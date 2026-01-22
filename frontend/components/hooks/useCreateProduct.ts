"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./useProgram";
import { toU8Array16 } from "@/utils/toU8Array16";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "sonner";
import { Keypair } from "@solana/web3.js";
import { pinata } from "@/utils/ipfsConfig";

interface CreateProductInput {
  name: string;
  productId: string;
  batchNumber: string;
  quantity: number;
}

export function useCreateProduct() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const urlRequest = await fetch("/api/url");
      const urlResponse = await urlRequest.json();

      const metadata = await pinata.upload.public
        .json({
          name: `${input.name} - ${input.productId}`,
          description: input.name,
          attributes: [
            { trait_type: "Batch Number", value: input.batchNumber },
            { trait_type: "Product Id", value: input.productId },
            { trait_type: "Quantity", value: input.quantity },
          ],
        })
        .url(urlResponse.url);

      const metadataUri = await pinata.gateways.public.convert(metadata.cid);

      const productId = toU8Array16(input.productId);
      const batchNumber = toU8Array16(input.batchNumber);

      const asset = Keypair.generate();

      const product = await program.methods
        .createProduct(
          productId,
          batchNumber,
          input.name,
          new anchor.BN(input.quantity),
          {
            name: `${input.name} - ${input.productId}`,
            uri: metadataUri,
          }
        )
        .accounts({
          asset: asset.publicKey,
        })
        .signers([asset])
        .rpc();
    },

    onSuccess: () => {
      toast.success("Product created successfully");

      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (err: any) => {
      toast.error("Failed to create product", {
        description: err?.message ?? "Unexpected error",
      });
    },
  });
}
