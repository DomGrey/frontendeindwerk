import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "laraveleindwerk.ddev.site",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "closet-app-su7ez.ondigitalocean.app",
      },
    ],
    domains: ["laraveleindwerk.ddev.site"],
  },
};

export default nextConfig;
