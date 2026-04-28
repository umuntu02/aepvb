import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // DECISION: localPatterns restricts which internal paths next/image may
    // optimize. /api/images/** serves uploads from the persistent store;
    // /img/** covers static files already committed to public/.
    localPatterns: [
      { pathname: "/api/images/**" },
      { pathname: "/img/**" },
      { pathname: "/favicon_io/**" },
    ],
  },
};

export default nextConfig;
