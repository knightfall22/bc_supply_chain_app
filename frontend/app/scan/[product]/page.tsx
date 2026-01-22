"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PublicKey } from "@solana/web3.js";

import { useProduct } from "@/components/hooks/useProducts";
import ProductDetailsPage from "@/components/ui/ProductDetails";
import { useProgram } from "@/components/hooks/useProgram";
import { useAcceptTransfer } from "@/components/hooks/useAcceptTransfer";

const PARTICIPANTS_ACCOUNT = "participants_account";

export default function ScanProductPage() {
  const { product } = useParams<{ product: string }>();

  const { publicKey, program } = useProgram();
  const { data: productAccount } = useProduct(product);
  const acceptTransfer = useAcceptTransfer(product);

  const hasRun = useRef(false);

  useEffect(() => {
    if (!publicKey || !productAccount || hasRun.current) return;

    if (!productAccount.pendingCustodian) return;

    const [participantPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(PARTICIPANTS_ACCOUNT),
        productAccount.organization.toBuffer(),
        publicKey.toBuffer(),
      ],
      program.programId
    );

    if (!participantPda.equals(productAccount.pendingCustodian)) return;

    hasRun.current = true;
    acceptTransfer.mutate({ product });
  }, [publicKey, productAccount, acceptTransfer, program.programId]);

  return <ProductDetailsPage productAddress={product} />;
}
