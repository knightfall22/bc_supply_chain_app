import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./useProgram";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { pinata } from "@/utils/ipfsConfig";

interface CreateSealInput {
  file: File;
  name: string;
  description: string;
  productAddress: string;
}

interface SealMetadata {
  name: string;
  description: string;
  image: string;
  properties: {
    files: {
      uri: string;
      type: string;
    }[];
    category: "image";
  };
}

export const toIPFSURI = (cid: string) => `ipfs://${cid}`;

export function useCreateSeal() {
  const { program } = useProgram();
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateSealInput>({
    mutationFn: async ({ file, name, description, productAddress }) => {
      const urlRequest = await fetch("/api/url");
      const urlResponse = await urlRequest.json();

      const uploadFile = await pinata.upload.public
        .file(file)
        .url(urlResponse.url);

      const imageUri = await pinata.gateways.public.convert(uploadFile.cid);

      const metadata = await pinata.upload.public
        .json({
          name,
          description,
          image: imageUri,
          properties: {
            files: [{ uri: imageUri, type: "image/png" }],
            category: "image",
          },
        })
        .url(urlResponse.url);

      const metadataUri = await pinata.gateways.public.convert(metadata.cid);

      const asset = Keypair.generate();

      await program.methods
        .createSeal({
          name,
          uri: metadataUri,
        })
        .accounts({
          asset: asset.publicKey,
          product: productAddress,
        })
        .signers([asset])
        .rpc();
      return;
    },

    onSuccess: (metadata) => {
      console.log("Seal metadata ready:", metadata);
      toast.success("Seal uploaded");
    },

    onError: (err) => {
      toast.error("Failed to upload seal", {
        description: err.message,
      });
    },
  });
}
