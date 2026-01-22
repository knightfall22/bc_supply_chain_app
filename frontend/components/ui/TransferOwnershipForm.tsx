"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useInitiateTransfer } from "@/components/hooks/useInitiateTransfer";
import { useParticipantsFromProduct } from "../hooks/useParticipantsFromProduct";

interface Props {
  product: any;
  productAddress: string;
}

const TransferOwnershipForm = ({ product, productAddress }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const { data: participants } = useParticipantsFromProduct(product);
  const { mutate, isPending } = useInitiateTransfer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        product: productAddress,
        destination: selected,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelected("");
        },
      }
    );
  };

  if (!participants) {
    return <p className="text-xs text-muted">Loading participants…</p>;
  }

  if (participants.length === 0) {
    return <p className="text-xs text-muted">No participants available</p>;
  }

  return (
    <>
      {/* Trigger button (matches your current UX) */}
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium underline underline-offset-4 hover:opacity-70 cursor-pointer"
      >
        Transfer ownership
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
          />

          {/* Modal */}
          <div
            className="
              relative z-10 w-full sm:max-w-md
              rounded-t-xl sm:rounded-xl
              bg-card p-6
              border border-border-low
              shadow-xl
              animate-scale-in
            "
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Transfer ownership</h3>
                <p className="text-xs text-muted mt-1">
                  Select the next custodian for this product
                </p>
              </div>

              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                required
                className="
                  w-full rounded-md border border-border
                  px-3 py-2 text-sm
                  bg-transparent outline-none
                "
              >
                <option value="" disabled>
                  Select participant
                </option>

                {participants.map((p) => (
                  <option
                    key={p.publicKey}
                    value={p.account.address.toBase58()}
                  >
                    {p.account.name} · {Object.keys(p.account.role)[0]}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={!selected || isPending}
                className="wallet-button-reset w-full"
              >
                {isPending ? "Transferring…" : "Initiate transfer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferOwnershipForm;
