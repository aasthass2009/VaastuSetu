import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "pg",
    "pg-native",
    "@prisma/adapter-pg",
    "@prisma/client",
    "pdfkit",
  ],
};

export default withNextIntl(nextConfig);
