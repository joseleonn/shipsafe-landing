import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 13/11/2026: la guía de digitalizar inspecciones se fusionó con la de QR
  // (Google no la indexaba y repetía el mismo tema).
  async redirects() {
    return [
      {
        source: "/como-digitalizar-inspecciones-planta",
        destination: "/app-inspecciones-seguridad-qr",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
