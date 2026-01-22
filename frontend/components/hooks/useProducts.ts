"use client";

import { useQuery } from "@tanstack/react-query";
import { useProgram } from "./useProgram";
import { useOrganization } from "./useOrganization";
import { PublicKey } from "@solana/web3.js";

export interface Product {
  publicKey: PublicKey;
  account: any;
}

export function useProducts() {
  const { program } = useProgram();
  const { data: organization } = useOrganization();

  return useQuery<Product[]>({
    queryKey: ["products", organization?.address?.toBase58()],
    enabled: !!organization,

    queryFn: async () => {
      if (!organization) return [];

      const products = await program.account.product.all([
        {
          memcmp: {
            offset: 8,
            bytes: organization.address.toBase58(),
          },
        },
      ]);

      return products;
    },
  });
}

export function useProduct(productAddress: string) {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["product", productAddress],
    enabled: !!productAddress,

    queryFn: async () => {
      const pubkey = new PublicKey(productAddress);
      return program.account.product.fetch(pubkey);
    },
  });
}
