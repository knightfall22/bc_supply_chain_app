"use client";

import { useParticipants } from "@/components/hooks/useParticipants";

const roleLabel = (role: any) => Object.keys(role)[0];

const ParticipantsList = () => {
  const { data, isLoading, isError } = useParticipants();

  if (isLoading && !data) {
    return <p className="text-sm text-muted">Loading participants…</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-500">Failed to load participants</p>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-border-low bg-card p-4 text-sm text-muted">
        No participants found.
      </div>
    );
  }

  return (
    <div className="rounded-lg sm:rounded-xl border border-border-low bg-card divide-y divide-border-low">
      {data.map((p) => (
        <div
          key={p.publicKey}
          className="
            flex flex-col sm:flex-row
            sm:items-center sm:justify-between
            gap-3 sm:gap-6
            px-4 sm:px-6
            py-3 sm:py-4
          "
        >
          <div className="space-y-1 min-w-0">
            <div className="text-sm font-medium truncate sm:truncate-none">
              {p.account.name}
            </div>

            <div className="text-xs text-muted break-all">{p.publicKey}</div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 text-sm">
            <span className="capitalize text-xs sm:text-sm">
              {roleLabel(p.account.role)}
            </span>

            <span
              className={`text-xs ${
                p.account.verified ? "text-green-600" : "text-muted"
              }`}
            >
              {p.account.verified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsList;
