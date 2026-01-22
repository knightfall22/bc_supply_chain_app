"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateSeal } from "../hooks/useCreateSeal";

interface Props {
  productAddress: string;
}

const AddSealModal = ({ productAddress }: Props) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useCreateSeal();

  const handleUpload = () => {
    if (!file || !name || !description) return;

    const metadata = mutate({
      file,
      name,
      description,
      productAddress,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium underline underline-offset-4 hover:opacity-70 cursor-pointer"
      >
        Add seal
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-x-hidden">
          <div
            onClick={() => {
              if (isPending) return;
              setOpen(false);
              setFile(null);
            }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in overflow-hidden"
          />

          <div
            className="
                relative z-10 w-full max-w-md
                overflow-x-hidden
                rounded-xl bg-card border border-border-low
                p-6 space-y-6
                animate-scale-in
            "
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium tracking-tight">
                Add authentication seal
              </h2>
              <button
                disabled={isPending}
                onClick={() => {
                  if (isPending) return;
                  setOpen(false);
                  setFile(null);
                }}
                className="text-muted hover:text-foreground disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seal name"
                className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none"
                required
              />

              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="seal-upload"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                className="w-full rounded-md border border-border px-3 py-2 text-sm bg-transparent outline-none resize-none"
                required
              />

              <label
                htmlFor="seal-upload"
                className="
                  block w-full cursor-pointer rounded-md
                  border border-dashed border-border
                  px-4 py-6 text-center text-sm
                  text-muted hover:border-border-strong
                  transition
                "
              >
                {file ? (
                  <span className="text-foreground">{file.name}</span>
                ) : (
                  "Select image to upload"
                )}
              </label>

              {file && (
                <div className="text-xs text-muted text-center">
                  {Math.round(file.size / 1024)} KB · {file.type}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                disabled={!file || !name || !description || isPending}
                onClick={handleUpload}
                className="
                    wallet-button-reset w-full
                    flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading…
                  </>
                ) : (
                  "Upload image"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSealModal;
