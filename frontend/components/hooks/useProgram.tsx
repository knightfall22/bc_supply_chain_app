"use client";

import * as anchor from "@coral-xyz/anchor";
import { ScmProgram } from "@/anchor-idl/idl";
import { PublicKey } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import Idl from "@/anchor-idl/idl.json";

interface UserProgramReturn {
  program: anchor.Program<ScmProgram>;
  publicKey: PublicKey | null;
  connected: boolean;
  connection: anchor.web3.Connection;
}

export function useProgram(): UserProgramReturn {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  let program;

  if (wallet) {
    //Create a provider with the wallet and connection for signing transactions
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });

    program = new anchor.Program<ScmProgram>(Idl, provider);
  } else {
    program = new anchor.Program<ScmProgram>(Idl, { connection });
  }

  return {
    program,
    publicKey,
    connected,
    connection,
  };
}
