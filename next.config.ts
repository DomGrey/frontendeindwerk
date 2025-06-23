import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "laraveleindwerk.ddev.site",
      },
      {
        protocol: "https",
        hostname: "closet-app-su7ez.ondigitalocean.app",
      },
    ],
  },
};

export default nextConfig;
