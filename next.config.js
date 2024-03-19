/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  server: {
    port: 3002 // Puerto fijo
  }
};

module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
 
};
