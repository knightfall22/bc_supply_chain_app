"use client";

import { useQuery } from "@tanstack/react-query";
import { useProgram } from "./useProgram";
import { useOrganization } from "./useOrganization";

export interface ParticipantAccount {
  publicKey: string;
  account: any;
}

export function useParticipants() {
  const { program } = useProgram();
  const { data: organization } = useOrganization();

  return useQuery<ParticipantAccount[]>({
    queryKey: ["participants", organization?.address?.toBase58()],
    enabled: !!organization,

    queryFn: async () => {
      if (!organization) return [];

      const participants = await program.account.participant.all([
        {
          memcmp: {
            offset: 8,
            bytes: organization.address.toBase58(),
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
