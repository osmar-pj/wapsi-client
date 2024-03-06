/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
  server: {
    port: 3002 // Puerto fijo
  }
};
