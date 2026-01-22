"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AppLoader from "./AppLoader";

interface WalletGuardProps {
  children: ReactNode;
}

const WalletGuard: FC<WalletGuardProps> = ({ children }) => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <AppLoader />;

  if (!publicKey) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="editorial-card animate-rise w-full max-w-sm p-8 space-y-5">
          <h1 className="text-xl font-medium tracking-tight">
            Welcome
          </h1>

          <p className="text-sm text-muted leading-relaxed">
            Connect your wallet to continue exploring the app.
          </p>

          <WalletMultiButton className="wallet-button-reset w-full" />
        </div>
      </div>
    );
  }

  return <div className="animate-fade-in">{children}</div>;
};

export default WalletGuard;
