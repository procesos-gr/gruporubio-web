import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 85, 86, 88, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'http', hostname: 'localhost', port: '9000' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
