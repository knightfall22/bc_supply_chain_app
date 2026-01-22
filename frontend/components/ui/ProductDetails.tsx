"use client";

import decodeU8 from "@/utils/decodeU8";
import { useProduct } from "../hooks/useProducts";
import EventsBox from "./EventTimeline";
import TransferOwnershipForm from "./TransferOwnershipForm";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "../hooks/useProgram";
import ProductScanQR from "./ProductScanQR";
import AddSealForm from "./AddSealForm";
import { useOwnerAssets } from "../hooks/useOwnerAssets";
import ViewSealsButton from "./ViewSealsButton";
import { toast } from "sonner";

const PARTICIPANTS_ACCOUNT = "participants_account";

interface Props {
  productAddress: string;
}

const ProductDetailsPage = ({ productAddress }: Props) => {
  const { data: product, isLoading, isError } = useProduct(productAddress);
  const { program, publicKey } = useProgram();
  const { data: seals, isLoading: sealsLoading } =
    useOwnerAssets(productAddress);

  if (isLoading && !product) {
    return <p className="text-sm text-muted">Loading product…</p>;
  }

  if (isError || !product) {
    return <p className="text-sm text-red-500">Failed to load product</p>;
  }

  let isCustodian = false;

  let productState = Object.keys(product.state)[0];

  if (publicKey && productState != "delivered") {
    const [currentParticipantPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(PARTICIPANTS_ACCOUNT),
        product.organization.toBuffer(),
        publicKey.toBuffer(),
      ],
      program.programId
    );

    isCustodian = currentParticipantPda.equals(product.custodian.participant);
  }

  return (
    <section className="max-w-6xl mx-auto px-3 py-4 sm:px-6 sm:py-10 md:py-14 space-y-6 sm:space-y-8">
      <div className="relative rounded-lg sm:rounded-xl border border-border-low bg-card p-3 sm:p-6 md:p-8">
        <ProductScanQR productAddress={productAddress} />

        <div className="space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-3xl font-medium tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm text-muted mt-1 break-all">
              Product ID · {decodeU8(product.productId)}
            </p>
            <p
              onClick={() => {
                navigator.clipboard.writeText(productAddress);
                toast.success("Address copied to clipboard");
              }}
              className="mt-1 break-all text-[11px] text-muted cursor-pointer select-none hover:text-foreground transition mb-1"
              title="Click to copy address"
            >
              {productAddress}
            </p>
          </div>
          <div className="mb-5 sm:mb-0 grid grid-cols-2 grid-rows-2 gap-3 sm:gap-6 text-sm mt-1">
            <Meta label="Batch" value={decodeU8(product.batchNumber)} />
            <Meta label="Quantity" value={product.quantity.toString()} />
            <Meta label="State" value={productState} />
            <Meta
              label="Created"
              value={new Date(
                Number(product.createdAt) * 1000
              ).toLocaleDateString()}
            />
          </div>

          <div className="pt-2 sm:pt-1 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-4">
            {isCustodian && (
              <TransferOwnershipForm
                productAddress={productAddress}
                product={product}
              />
            )}

            {product.authenticated ? (
              <ViewSealsButton seals={seals as any} isLoading={sealsLoading} />
            ) : (
              <AddSealForm productAddress={productAddress} />
            )}
          </div>
        </div>
      </div>

      <EventsBox product={product} productAddress={productAddress} />
    </section>
  );
};

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-0.5">
    <div className="text-[10px] uppercase tracking-wide text-muted">
      {label}
    </div>
    <div className="text-sm sm:text-base leading-tight break-words">
      {value}
    </div>
  </div>
);

export default ProductDetailsPage;
