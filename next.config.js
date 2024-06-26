/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 /*  transpileModules: ["@mui/x-charts"], */
 
  publicRuntimeConfig: {
    NEXTAUTH_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  },

  
};

module.exports = nextConfig;
