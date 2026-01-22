"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "./useProgram";
import * as anchor from "@coral-xyz/anchor";

const EVENT_ACCOUNT = "event_account";

export function useProductEvents(product: any, productAddress: string) {
  const { program } = useProgram();

  console.log("This is from the events", productAddress);

  return useQuery({
    queryKey: ["events", productAddress],
    enabled: !!product,

    queryFn: async () => {
      if (!product) return [];

      const events = [];

      const event_index_count = product.eventIndexCount.toNumber();

      for (let i = 0; i < event_index_count; i++) {
        const [eventPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from(EVENT_ACCOUNT),
            Buffer.from(product.productId),
            new anchor.BN(i).toArrayLike(Buffer, "le", 8),
          ],
          program.programId
        );

        const event = await program.account.event.fetch(eventPda);
        events.push(event);
      }

      return events;
    },
  });
}
