import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SolanaProvider } from "../components/providers";
import WalletGaurd from "../components/ui/WalletGaurd";
import QueryProvider from "../components/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solana dApp Starter",
  description: "A minimal Next.js starter powered by @solana/react-hooks",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
          suppressHydrationWarning
          className={`${inter.variable} ${geistMono.variable} antialiased`}
          >
          <QueryProvider>
            <SolanaProvider>
              <WalletGaurd>
                <Toaster position="top-center" />
                {children}
              </WalletGaurd>
            </SolanaProvider>
          </QueryProvider>
        </body>
    </html>
  );
}
