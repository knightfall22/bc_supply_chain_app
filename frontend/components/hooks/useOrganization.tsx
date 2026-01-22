"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "./useProgram";

const ORGANIZATION_ACCOUNT = "organization_account";

export interface OrganizationState {
  address: PublicKey;
  data: any;
}

export function useOrganization() {
  const { program, publicKey } = useProgram();

  return useQuery<OrganizationState | null>({
    queryKey: ["organization", publicKey?.toBase58()],
    enabled: !!publicKey,
    staleTime: Infinity,

    queryFn: async () => {
      if (!publicKey) return null;

      const [organizationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(ORGANIZATION_ACCOUNT), publicKey.toBuffer()],
        program.programId
      );

      try {
        const data = await program.account.organization.fetch(organizationPda);
        
        return {
          address: organizationPda,
          data,
        };
      } catch (err: any) {
        if (err.message?.includes("Account does not exist")) {
          return null;
        }
        throw err;
      }
    },
  });
}
