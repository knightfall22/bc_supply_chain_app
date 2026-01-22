"use client";

import { useEffect } from "react";

interface SealModalProps {
  seals: {
    publicKey: string;
    name: string;
    image: string;
  }[];
  onClose: () => void;
}

const SealModal = ({ seals, onClose }: SealModalProps) => {
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  console.log("seals", seals);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="
          relative w-full sm:max-w-lg
          bg-card rounded-t-xl sm:rounded-xl
          p-4 sm:p-6
          max-h-[85vh] overflow-y-auto
        "
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Product Seals</h2>
          <button
            onClick={onClose}
            className="text-sm text-muted hover:text-foreground"
          >
            Close
          </button>
        </div>

        {seals && seals.length === 0 ? (
          <p className="text-sm text-muted">No seals found for this product.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {seals.map((seal) => (
              <div
                key={seal.publicKey}
                className="rounded-lg border border-border-low p-2"
              >
                <div className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={seal.image}
                    alt={seal.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-2 text-sm font-medium truncate">
                  {seal.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SealModal;
