"use client";

import { useState } from "react";
import SealModal from "./SealModal";

interface ViewSealsButtonProps {
  seals: any[];
  isLoading: boolean;
}

const ViewSealsButton = ({ seals, isLoading }: ViewSealsButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!isLoading && (
        <button
          onClick={() => setOpen(true)}
          className="text-sm font-medium underline underline-offset-4 hover:opacity-70 cursor-pointer"
        >
          View seal
        </button>
      )}

      {open && <SealModal seals={seals} onClose={() => setOpen(false)} />}
    </>
  );
};

export default ViewSealsButton;
