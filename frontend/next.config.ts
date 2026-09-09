import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Build "standalone" — imagem Docker menor, mesmo padrão usado no
  // Controle NF, caso o site venha a ser hospedado num VPS.
  output: 'standalone',
};

export default nextConfig;
