import type { NextConfig } from "next";
import os from "os";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@versaprotocol/semval"],
  env: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },
  async rewrites() {
    return [
      {
        source: "/GITHUB_CONTENT_URL/:path*",
        destination: "https://raw.githubusercontent.com/:path*",
      },
    ];
  },
  images: {
    domains: [
      "us-east-1-shared-usea1-02.graphassets.com",
      "imagedelivery.net",
      "v1.spadeapi.com",
      "logo.clearbit.com",
      "static.v2.spadeapi.com",
      "api.mapbox.com",
      "versa.org",
    ],
  },
};

export default nextConfig;
