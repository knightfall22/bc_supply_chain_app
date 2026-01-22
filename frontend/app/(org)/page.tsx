import ParticipantsList from "@/components/ui/ParticipantsList";
import ProductList from "@/components/ui/ProductList";

export default function OrgHome() {
  return (
    <main className="max-w-6xl mx-auto px-3 py-4 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-medium tracking-tight">
          Organization Dashboard
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          Manage your organization’s products, track their lifecycle, and view
          all registered participants in one place.
        </p>
      </header>

      {/* Products */}
      <section className="space-y-3">
        <h2 className="text-xs sm:text-sm font-medium uppercase tracking-wide text-muted">
          Products
        </h2>

        <ProductList />
      </section>

      {/* Participants */}
      <section className="space-y-3">
        <h2 className="text-xs sm:text-sm font-medium uppercase tracking-wide text-muted">
          Participants
        </h2>

        <ParticipantsList />
      </section>
    </main>
  );
}
