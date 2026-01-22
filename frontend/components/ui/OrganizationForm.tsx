"use client";

import { useState } from "react";
import { useCreateOrganization } from "../hooks/useCreateOrganization";

const OrganizationForm = () => {
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateOrganization();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    mutate(name);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Organization name"
        className="
          w-full rounded-md border border-border px-3 py-2
          text-sm bg-transparent outline-none
        "
        required
      />

      <button
        type="submit"
        className="wallet-button-reset w-full"
      >
        Create organization
      </button>
    </form>
  );
};

export default OrganizationForm;
