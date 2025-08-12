/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Ou 'export' se for site estático
  trailingSlash: true, // Opcional - ajuda com rotas
  env: {
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  },
  // Adicione esta configuração se estiver usando imagens
  images: {
    unoptimized: true, // Recomendado para export estático
  }
}

module.exports = nextConfig
