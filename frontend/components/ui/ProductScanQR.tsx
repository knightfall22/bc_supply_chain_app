"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X, QrCode } from "lucide-react";

interface Props {
  productAddress: string;
}

const ProductScanQR = ({ productAddress }: Props) => {
  const [open, setOpen] = useState(false);

  const scanUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/scan/${productAddress}`
      : "";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 text-muted hover:text-foreground transition cursor-pointer"
        title="Scan product"
      >
        <QrCode className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
          />

          <div
            className="
              relative z-10 w-full max-w-sm rounded-xl bg-card p-6
              shadow-xl border border-border-low
              animate-scale-in
            "
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 text-center">
              <h2 className="text-lg font-medium tracking-tight">
                Scan to product
              </h2>

              <p className="text-sm text-muted">
                Scan this QR code to open the product in scan mode
              </p>

              <div className="flex justify-center rounded-lg bg-white p-4">
                <QRCodeCanvas
                  value={scanUrl}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="text-xs text-muted break-all">{scanUrl}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductScanQR;
