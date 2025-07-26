import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { defineConfig as testConfig } from 'vitest/config'

const exclusions = [
    'node_modules',
    'public',
    'prisma',
    '.next',
    './app/generated',
    './middleware.ts',
    '**/*.config*',
    '.vscode',
]

// Vite configuration
const config = defineConfig({
    plugins: [react()],
})

// Vitest configuration
const tstConfig = testConfig({
    test: {
        environment: 'jsdom',
        exclude: exclusions,
        coverage: {
            exclude: exclusions,
        },
        setupFiles: './tests/setup.js',
    },
})

// Merge configurations
export default {
    ...config,
    ...tstConfig,
}
