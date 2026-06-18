/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pg", "pg-native", "@prisma/adapter-pg", "@prisma/client", "pdfkit"],
};

export default nextConfig;
