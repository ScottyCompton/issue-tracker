/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cardosystems.com',
                pathname: '/cdn/shop/articles/**',
            }
        ]
    }
}

module.exports = nextConfig
