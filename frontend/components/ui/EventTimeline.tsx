"use client";

import { useProductEvents } from "@/components/hooks/useProductEvents";

const EVENT_LABELS: Record<string, string> = {
  Created: "Created",
  CustodyTransferred: "Custody transferred",
  CustodyReceived: "Custody received",
  CheckPointScan: "Checkpoint scan",
  ProductDelivered: "Delivered",
};

const SYSTEM_PROGRAM = "11111111111111111111111111111111";

const EventsBox = ({
  product,
  productAddress,
}: {
  product: any;
  productAddress: string;
}) => {
  const { data: events, isLoading } = useProductEvents(product, productAddress);

  return (
    <div className="rounded-xl border border-border-low bg-card p-4 sm:p-6 md:p-8">
      <div className="space-y-6">
        <h2 className="text-base sm:text-lg font-medium tracking-tight">
          Event history
        </h2>

        {isLoading && <p className="text-sm text-muted">Loading events…</p>}

        {!isLoading && (!events || events.length === 0) && (
          <p className="text-sm text-muted">No events recorded.</p>
        )}

        <div className="space-y-4">
          {events?.map((event, idx) => {
            const type = Object.keys(event.eventType)[0];
            const destination = event.destination?.toBase58?.() ?? null;

            return (
              <div
                key={idx}
                className="
                  flex flex-col sm:flex-row
                  sm:items-start sm:justify-between
                  gap-4 sm:gap-8
                  border-b border-border-low
                  pb-4 last:border-b-0
                "
              >
                {/* Left */}
                <div className="space-y-1 min-w-0">
                  <div className="text-sm font-medium">
                    {EVENT_LABELS[type] ?? type}
                  </div>

                  <div className="text-xs text-muted">
                    Event #{event.eventIndex.toString()}
                  </div>

                  <div className="text-xs text-muted break-all">
                    Producer · {event.producer.toBase58()}
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-1 sm:text-right">
                  <div className="text-sm">
                    {new Date(Number(event.timestamp) * 1000).toLocaleString()}
                  </div>

                  {destination && destination !== SYSTEM_PROGRAM && (
                    <div className="text-xs text-muted break-all">
                      Destination · {destination}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventsBox;
