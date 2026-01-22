import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { makeKeypairs, airdropIfRequired } from "@solana-developers/helpers";
import { ScmProgram } from "../target/types/scm_program";
import { randomBytes } from "node:crypto";
import { PublicKey, Keypair } from "@solana/web3.js";
import { assert } from "chai";

const ORGANIZATION_ACCOUNT = "organization_account";
const PARTICIPANTS_ACCOUNT = "participants_account";
const PRODUCT_ACCOUNT = "product_account";
const EVENT_ACCOUNT = "event_account";

let event_count_index = new anchor.BN(0);
describe("scm-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const program = anchor.workspace.scmProgram as Program<ScmProgram>;
  const testAccounts = makeKeypairs(2);
  const batchNumber = Array.from(randomBytes(16));
  const productId = Array.from(randomBytes(16));

  const wallet = program.provider.wallet;
  const VSpirit = testAccounts[0];
  const EternityGate = testAccounts[1];

  const [organization] = PublicKey.findProgramAddressSync(
    [Buffer.from(ORGANIZATION_ACCOUNT), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [product] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(PRODUCT_ACCOUNT),
      organization.toBuffer(),
      Buffer.from(productId),
    ],
    program.programId
  );

  it("Should airdrop to participants", async () => {
    for (const testAccount of testAccounts) {
      await airdropIfRequired(
        provider.connection,
        testAccount.publicKey,
        1000000000,
        1000000000
      );
    }
  });

  it("Create organization", async () => {
    // Add your test here.
    const tx = await program.methods
      .registerOrganization("Organization 1")
      .rpc();
  });

  it("Register Participant", async () => {
    for (const participant of testAccounts) {
      const tx = await program.methods
        .registerParticipants(participant.publicKey, "Participant", {
          distributor: {},
        })
        .rpc();
    }
  });

  it("Create Product", async () => {
    const quantity = new anchor.BN(100);

    const tx = await program.methods
      .createProduct(productId, batchNumber, "Product", quantity)
      .rpc();

    const createdProduct = await program.account.product.fetch(product);

    assert.equal(
      createdProduct.eventIndexCount.toNumber(),
      event_count_index.toNumber() + 1
    );

    const [event] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(EVENT_ACCOUNT),
        Buffer.from(productId),
        event_count_index.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const createdEvent = await program.account.event.fetch(event);

    assert.equal(
      createdEvent.eventIndex.toNumber(),
      event_count_index.toNumber()
    );

    event_count_index = event_count_index.add(new anchor.BN(1));
  });

  it("create authentication seal", async () => {
    let asset = Keypair.generate();
    const tx = await program.methods
      .createSeal({
        name: "Test",
        uri: "https://example.com/my-asset.json",
      })
      .accounts({
        asset: asset.publicKey,
        product,
      })
      .signers([asset, wallet.payer])
      .rpc();

    console.log(asset.publicKey.toBase58());
    console.log(tx);
  });

  const [VSpiritParticipant] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(PARTICIPANTS_ACCOUNT),
      organization.toBuffer(),
      VSpirit.publicKey.toBuffer(),
    ],
    program.programId
  );

  it("Should fail to change hands with itself", async () => {
    try {
      const tx = await program.methods
        .initiateTransfer(wallet.publicKey)
        .accounts({ product })
        .rpc();
    } catch (error) {
      const err = error as anchor.AnchorError;

      assert.strictEqual(err.error.errorCode.code, "InvalidCustodianTransfer");
    }
  });

  it("Should fail beaceause it's not the custodian", async () => {
    try {
      const tx = await program.methods
        .initiateTransfer(EternityGate.publicKey)
        .accounts({
          authority: VSpirit.publicKey,
          product,
        })
        .signers([VSpirit])
        .rpc();
    } catch (error) {
      const err = error as anchor.AnchorError;

      assert.strictEqual(err.error.errorCode.code, "NotCurrentCustodian");
    }
  });

  it("Should initialize transfer", async () => {
    const tx = await program.methods
      .initiateTransfer(VSpirit.publicKey)
      .accounts({ product })
      .rpc();

    const updatedProduct = await program.account.product.fetch(product);

    assert.equal(
      updatedProduct.pendingCustodian.toBase58(),
      VSpiritParticipant.toBase58()
    );
    assert.deepStrictEqual(updatedProduct.state.inTransit, {});
    assert.equal(
      updatedProduct.eventIndexCount.toNumber(),
      event_count_index.toNumber() + 1
    );

    const [event] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(EVENT_ACCOUNT),
        Buffer.from(productId),
        event_count_index.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const createdEvent = await program.account.event.fetch(event);

    assert.equal(
      createdEvent.eventIndex.toNumber(),
      event_count_index.toNumber()
    );

    event_count_index = event_count_index.add(new anchor.BN(1));
  });

  it("Should accept transfer", async () => {
    const tx = await program.methods
      .acceptTransfer()
      .accounts({
        authority: VSpirit.publicKey,
        product,
      })
      .signers([VSpirit])
      .rpc();

    const updatedProduct = await program.account.product.fetch(product);

    assert.deepStrictEqual(updatedProduct.state.arrived, {});
    assert.equal(
      updatedProduct.custodian.participant.toBase58(),
      VSpiritParticipant.toBase58()
    );
    assert.equal(
      updatedProduct.eventIndexCount.toNumber(),
      event_count_index.toNumber() + 1
    );

    const [event] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(EVENT_ACCOUNT),
        Buffer.from(productId),
        event_count_index.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const createdEvent = await program.account.event.fetch(event);

    assert.equal(
      createdEvent.eventIndex.toNumber(),
      event_count_index.toNumber()
    );

    event_count_index = event_count_index.add(new anchor.BN(1));
  });

  it("Update Participant name", async () => {
    const name = "Participant one";

    const tx = await program.methods
      .updateName(name)
      .accounts({
        participant: VSpiritParticipant,
      })
      .rpc();

    const updatedParticipant = await program.account.participant.fetch(
      VSpiritParticipant
    );

    assert.equal(updatedParticipant.name, name);
  });

  it("Upadate Participant role", async () => {
    const tx = await program.methods
      .updateRole({
        manufacturer: {},
      })
      .accounts({
        participant: VSpiritParticipant,
      })
      .rpc();

    const updatedParticipant = await program.account.participant.fetch(
      VSpiritParticipant
    );

    assert.deepStrictEqual(updatedParticipant.role.manufacturer, {});
  });

  it("Toggle Participant verification", async () => {
    const tx = await program.methods
      .toggleVerification()
      .accounts({
        participant: VSpiritParticipant,
      })
      .rpc();

    const updatedParticipant = await program.account.participant.fetch(
      VSpiritParticipant
    );

    assert.equal(updatedParticipant.verified, true);
  });
});
