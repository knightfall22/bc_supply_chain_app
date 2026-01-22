"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "./useProgram";

export interface ParticipantAccount {
  publicKey: string;
  account: any;
}
export function useParticipantsFromProduct(product?: {
  organization: PublicKey;
}) {
  const { program } = useProgram();

  return useQuery<ParticipantAccount[]>({
    queryKey: ["participants-from-product", product?.organization?.toBase58()],
    enabled: !!product?.organization,
    staleTime: Infinity,

    queryFn: async () => {
      if (!product?.organization) return [];

      const participants = await program.account.participant.all([
        {
          memcmp: {
            offset: 8,
            bytes: product.organization.toBase58(),
          },
        },
      ]);

      return participants.map((p) => ({
        publicKey: p.publicKey.toBase58(),
        account: p.account,
      }));
    },
  });
}
