/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'standalone',
  distDir: 'dist',
  
  // Configurações de imagem
  images: {
    unoptimized: true,
  },

  // Modularize imports para MUI
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },

  // Configuração de variáveis de ambiente públicas
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
  },

  // Configuração do webpack
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  // Configurações de desenvolvimento
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
