import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        pathname: '/igdb/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: '*.igdb.com',
      },
      {
        protocol: 'https',
        hostname: 'mediaproxy.tvtropes.org',
      },
      {
        protocol: 'https',
        hostname: '*.tvtropes.org',
      },
      {
        protocol: 'https',
        hostname: 'img.rawg.io',
      },
      {
        protocol: 'https',
        hostname: '*.rawg.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.steampowered.com',
      },
      {
        protocol: 'https',
        hostname: 'images.gamereleases.com',
      },
      {
        protocol: 'https',
        hostname: '*.gamereleases.com',
      },
      {
        protocol: 'https',
        hostname: 'a.thumbs.redditmedia.com',
      },
      {
        protocol: 'https',
        hostname: '*.redditmedia.com',
      },
      {
        protocol: 'https',
        hostname: 'www.konsolinet.fi',
      },
      {
        protocol: 'https',
        hostname: '*.konsolinet.fi',
      },
      {
        protocol: 'https',
        hostname: 'uvejuegos.com',
      },
      {
        protocol: 'https',
        hostname: '*.uvejuegos.com',
      },
    ],
  },
};

export default nextConfig;
