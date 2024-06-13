const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  reloadOnOnline: false,
  cacheOnFrontEndNav: true,
  sw: "sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  },
  //  output: "export",
  //  distDir: "dist",
};

module.exports = withPWA(nextConfig);