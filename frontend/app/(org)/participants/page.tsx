import ParticipantsList from "@/components/ui/ParticipantsList";

export default function ParticipantsPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Participants</h1>
        <p className="text-sm text-muted">
          All registered participants in this organization
        </p>
      </header>

      <ParticipantsList />
    </section>
  );
}
