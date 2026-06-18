/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js to treat these packages as Node.js externals (don't bundle them).
  // Required for Prisma's driver adapter (pg) and the generated client.
  experimental: {
    serverComponentsExternalPackages: ["pg", "pg-native", "@prisma/adapter-pg", "@prisma/client"],
  },
};

export default nextConfig;
