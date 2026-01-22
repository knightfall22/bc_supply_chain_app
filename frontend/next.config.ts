import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ws"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.irys.xyz",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
