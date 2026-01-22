"use client";

import { useForm } from "react-hook-form";
import { useCreateProduct } from "@/components/hooks/useCreateProduct";

interface FormValues {
  name: string;
  productId: string;
  batchNumber: string;
  quantity: number;
}

const CreateProductForm = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { mutate, isPending } = useCreateProduct();

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="editorial-card space-y-6 p-8 max-w-md"
    >
      <header className="space-y-1">
        <h1 className="text-xl font-medium tracking-tight">Create product</h1>
        <p className="text-sm text-muted">Register a new product batch</p>
      </header>

      <div className="space-y-4">
        <input
          {...register("name", { required: true })}
          placeholder="Product name"
          className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none"
          disabled={isPending}
        />
        <input
          {...register("productId", { required: true })}
          placeholder="Product ID (≤16 chars)"
          className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none"
          disabled={isPending}
        />

        <input
          {...register("batchNumber", { required: true })}
          placeholder="Batch number (≤16 chars)"
          className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none"
          disabled={isPending}
        />

        <input
          {...register("quantity", {
            required: true,
            valueAsNumber: true,
            min: 1,
          })}
          type="number"
          placeholder="Quantity"
          className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none"
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="wallet-button-reset w-full"
      >
        {isPending ? "Creating…" : "Create product"}
      </button>
    </form>
  );
};

export default CreateProductForm;
