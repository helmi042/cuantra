/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    TZ: "Asia/Jakarta"
  },
  experimental: {
    turbo: false
  }
};

export default nextConfig;
