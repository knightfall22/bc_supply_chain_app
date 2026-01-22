"use client";

import OrganizationGuard from "@/components/ui/OrganizationGaurd";
import OrganizationNavbar from "@/components/ui/OrganizationNavbar";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <OrganizationGuard>
        <OrganizationNavbar />
            <main className="mx-auto max-w-5xl px-6 py-10">
                {children}
            </main>
      </OrganizationGuard>
  );
}
