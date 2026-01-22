"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./useProgram";
import { toast } from "sonner";
import { useProduct } from "./useProducts";

interface AcceptTransferInput {
  product: any;
}

export function useAcceptTransfer(programAddress: string) {
  const { program, publicKey } = useProgram();
  const { data: programAcc } = useProduct(programAddress);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product }: AcceptTransferInput) => {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!programAcc) throw new Error("Product not found");

      console.log("Custodian", programAcc.custodian);

      await program.methods
        .acceptTransfer()
        .accounts({
          asset: programAcc.asset,
          authority: publicKey,
          product,
        })
        .rpc();
    },

    onSuccess: (product) => {
      toast.success("Transfer accepted");
      queryClient.invalidateQueries({ queryKey: ["product", product] });
      queryClient.invalidateQueries({ queryKey: ["products", product] });
      queryClient.invalidateQueries({
        queryKey: ["events", product],
      });
    },

    onError: (err: any) => {
      console.log(err);
      toast.error("Failed to accept transfer", {
        description: err?.message ?? "Unexpected error",
      });
    },
  });
}
