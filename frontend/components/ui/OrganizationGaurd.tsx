"use client";

import { FC, ReactNode } from "react";
import { useOrganization } from "@/components/hooks/useOrganization";
import AppLoader from "./AppLoader";
import OrganizationForm from "./OrganizationForm";

interface OrganizationGuardProps {
  children: ReactNode;
}

const OrganizationGuard: FC<OrganizationGuardProps> = ({ children }) => {
  const { data: organization, isLoading } = useOrganization();

  if (isLoading && !organization) {
    return <AppLoader />;
  }

  if (!organization) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="editorial-card animate-rise w-full max-w-sm p-8">
          <div className="flex flex-col items-center text-center space-y-5">
            <h1 className="text-xl font-medium tracking-tight">
              Create organization
            </h1>

            <p className="text-sm text-muted leading-relaxed max-w-xs">
              An organization is required to continue.
            </p>

            <OrganizationForm />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OrganizationGuard;
