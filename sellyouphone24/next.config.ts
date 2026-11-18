import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      // 1. Apex to WWW Canonical Redirect (301 Permanent)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'sellphonecash.com',
          },
        ],
        destination: 'https://www.sellphonecash.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Global Security Headers
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      // Private, Transactional & Administrative Routes: Strictly NO-CACHE
      {
        source: '/:path(admin|admin/.*|cart|cart/.*|buy-phones/cart|buy-phones/checkout|analytics|analytics/.*|api/.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
      // Public Marketing & Catalog Pages: Edge & CDN Caching
      {
        source: '/:path((?!admin|cart|buy-phones/cart|buy-phones/checkout|analytics|api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: process.env.BACKEND_API_URL ? `${process.env.BACKEND_API_URL}/uploads/:path*` : 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
