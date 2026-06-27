import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@storyfox/audio",
    "@storyfox/config",
    "@storyfox/story-engine",
    "@storyfox/types",
    "@storyfox/ui",
    "@storyfox/utils"
  ]
};

export default nextConfig;
