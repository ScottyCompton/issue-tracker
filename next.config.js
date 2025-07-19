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
    },
    webpack: (config, { isServer, dev }) => {
        // Completely disable file watching in production builds
        if (!dev) {
            config.watchOptions = {
                ignored: ['**/*']
            }
        } else {
            config.watchOptions = {
                ignored: [
                    '**/node_modules/**',
                    '**/.next/**',
                    '**/C:/Users/**',
                    '**/C:/ProgramData/**',
                    '**/C:/Windows/**',
                    '**/C:/Program Files/**',
                    '**/C:/Program Files (x86)/**',
                    '**/AppData/**',
                    '**/Application Data/**'
                ]
            }
        }
        
        // Disable file system caching that might cause issues
        config.infrastructureLogging = {
            level: 'error'
        }
        
        return config
    }
}

module.exports = nextConfig
