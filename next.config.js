/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  const nextConfig = {
  output: 'standalone', // Ou 'export' se for site estático
  trailingSlash: true, // Opcional - ajuda com rotas
}

module.exports = nextConfig
  env: {
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  },
}

module.exports = nextConfig
