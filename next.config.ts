import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        port: '',
        pathname: '/account123/**',
      },
      {
        protocol: 'https',
        hostname: '1jhege1xa8.ufs.sh', // Add this line
        port: '',
        pathname: '/**', // Adjust the pathname as needed
      },
    ],
  },
}

export default nextConfig
