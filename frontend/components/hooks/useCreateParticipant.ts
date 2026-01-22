"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./useProgram";
import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { useOrganization } from "./useOrganization";

interface CreateParticipantInput {
  address: string;
  name: string;
  role: "Manufacturer" | "Distributor" | "Retailer";
}

const ORGANIZATION_ACCOUNT = "organization_account";
const PARTICIPANTS_ACCOUNT = "participants_account";

export function useCreateParticipant() {
  const { program, publicKey } = useProgram();
  const { data: organizationEntity } = useOrganization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateParticipantInput) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const participantAddress = new PublicKey(input.address);

      const [organization] = PublicKey.findProgramAddressSync(
        [Buffer.from(ORGANIZATION_ACCOUNT), publicKey.toBuffer()],
        program.programId
      );

      const [participant] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(PARTICIPANTS_ACCOUNT),
          organization.toBuffer(),
          participantAddress.toBuffer(),
        ],
        program.programId
      );

      await program.methods
        .registerParticipants(
          participantAddress,
          input.name,
          roleToEnum(input.role)
        )
        .accounts({
          authority: publicKey,
          organization,
          participant,
        })
        .rpc();
    },

    onSuccess: () => {
      toast.success("Participant added");
      queryClient.invalidateQueries({
        queryKey: ["participants", organizationEntity?.address.toBase58()],
      });
    },

    onError: (err: any) => {
      toast.error("Failed to add participant", {
        description: err?.message ?? "Unexpected error",
      });
    },
  });
}

function roleToEnum(role: CreateParticipantInput["role"]) {
  switch (role) {
    case "Manufacturer":
      return { manufaturer: {} };
    case "Distributor":
      return { distributor: {} };
    case "Retailer":
      return { retailer: {} };
  }
}
