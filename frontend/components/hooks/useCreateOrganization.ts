import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "./useProgram";
import { toast } from "sonner";

const ORGANIZATION_ACCOUNT = "organization_account";

export function useCreateOrganization() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [organizationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(ORGANIZATION_ACCOUNT), publicKey.toBuffer()],
        program.programId
      );

      await program.methods.registerOrganization(name).rpc();
      return {
        address: organizationPda,
        data: {
          name,
          authority: publicKey,
        },
      };
    },

    onSuccess: (organization) => {
      queryClient.setQueryData(
        ["organization", publicKey?.toBase58()],
        organization
      );

      toast.success("Organization created");
    },

    onError: (err: any) => {
      toast.error("Failed to create organization", {
        description: err?.message ?? "Unexpected error",
      });
    },
  });
}
