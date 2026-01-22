"use client";

import { useForm } from "react-hook-form";
import { useCreateParticipant } from "@/components/hooks/useCreateParticipant";
import { PublicKey } from "@solana/web3.js";

interface FormValues {
  address: string;
  name: string;
  role: "Manufacturer" | "Distributor" | "Retailer";
}

const CreateParticipantForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      role: "Manufacturer",
    },
  });

  const { mutate, isPending } = useCreateParticipant();

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="editorial-card space-y-6 p-8 max-w-md"
    >
      <header className="space-y-1">
        <h1 className="text-xl font-medium tracking-tight">Add participant</h1>
        <p className="text-sm text-muted">
          Register a new participant in this organization
        </p>
      </header>

      <div className="space-y-4">
        {/* Address */}
        <div className="space-y-1">
          <input
            {...register("address", {
              required: "Wallet address is required",
              validate: (value) => {
                try {
                  new PublicKey(value);
                  return true;
                } catch {
                  return "Invalid Solana public key";
                }
              },
            })}
            placeholder="Wallet address"
            className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none"
            disabled={isPending}
          />

          {errors.address && (
            <p className="text-xs text-red-500">{errors.address.message}</p>
          )}
        </div>

        {/* Name */}
        <input
          {...register("name", { required: true })}
          placeholder="Participant name"
          className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none"
          disabled={isPending}
        />

        {/* Role */}
        <select
          {...register("role")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none"
          disabled={isPending}
        >
          <option value="Manufacturer">Manufacturer</option>
          <option value="Distributor">Distributor</option>
          <option value="Retailer">Retailer</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="wallet-button-reset w-full"
      >
        {isPending ? "Adding…" : "Add participant"}
      </button>
    </form>
  );
};

export default CreateParticipantForm;
