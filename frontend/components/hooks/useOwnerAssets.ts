"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCore,
  fetchAssetsByOwner,
  fetchAsset,
} from "@metaplex-foundation/mpl-core";
import { fetchMetadata, SealMetadata } from "@/utils/fetchMetadata";

export function useOwnerAssets(owner?: string) {
  return useQuery({
    queryKey: ["owner-assets", owner?.toString()],
    enabled: !!owner,
    queryFn: async () => {
      if (!owner) return [];

      const umi = createUmi("https://api.devnet.solana.com").use(mplCore());

      const assets = await fetchAssetsByOwner(umi, owner);
      const metadata = await fetchMetadata<SealMetadata>(assets[0].uri);

      return [
        {
          publicKey: assets[0].publicKey,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        },
      ];
    },
  });
}
