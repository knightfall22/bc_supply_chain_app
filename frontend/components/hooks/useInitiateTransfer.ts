"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useProgram } from "./useProgram";
import { toast } from "sonner";

interface InitiateTransferInput {
  product: any; // fetched product account
  destination: string; // participant wallet address
}

let productId: string;
export function useInitiateTransfer() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation<void, Error, InitiateTransferInput>({
    mutationFn: async ({ product, destination }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const destinationPk = new PublicKey(destination);

      await program.methods
        .initiateTransfer(destinationPk)
        .accounts({
          product,
        })
        .rpc();
    },

    onSuccess: (_, variables) => {
      const productAddress = variables.product;

      console.log(
        queryClient
          .getQueryCache()
          .getAll()
          .map((q) => q.queryKey)
      );
      toast.success("Transfer initiated");

      queryClient.invalidateQueries({
        queryKey: ["product", productAddress],
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["events", productAddress],
        exact: true,
      });

      queryClient.refetchQueries({
        queryKey: ["events", productAddress],
      });
      console.log(["events", productAddress]);
      console.log(
        queryClient
          .getQueryCache()
          .getAll()
          .map((q) => q.queryKey)
      );
    },

    onError: (err) => {
      toast.error("Transfer failed", {
        description: err.message ?? "Unexpected error",
      });
    },
  });
}
