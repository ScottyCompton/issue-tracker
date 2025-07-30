import { Container, Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import ApolloProvider from './ApolloProvider'
import AuthProvider from './auth/Provider'
import Navbar from './components/Navbar'
import './globals.css'
import QueryClientProvider from './QueryClientProvider'
import './theme-config.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'Issue Tracker 1.0',
    description: 'Basic issue tracking and management application',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.variable}>
                <QueryClientProvider>
                    <ApolloProvider>
                        <AuthProvider>
                            <Theme>
                                <>
                                    <Navbar />
                                    <main className="p-5">
                                        <Container>{children}</Container>
                                    </main>
                                    <Toaster />
                                </>
                            </Theme>
                        </AuthProvider>
                    </ApolloProvider>
                </QueryClientProvider>
            </body>
        </html>
    )
}
