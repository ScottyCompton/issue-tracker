'use client'

import { Button, Flex, Heading, Text } from '@radix-ui/themes'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignInPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated' && session) {
            router.push('/')
        }
    }, [session, status, router])

    if (status === 'loading') {
        return (
            <div className="h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
            </div>
        )
    }

    if (status === 'authenticated') {
        return null
    }

    return (
        <div className="h-[calc(100vh-120px)] flex items-center justify-center">
            <div className="w-full max-w-md">
                <Flex direction="column" align="center" gap="6">
                    <div className="text-center">
                        <Heading size="6" className="mb-2">
                            Welcome to Issue Tracker
                        </Heading>
                        <Text size="3" color="gray" className="mb-8">
                            Sign in to manage your issues and track progress
                        </Text>
                    </div>

                    <Button
                        size="3"
                        className="w-full bg-white border border-zinc-300 text-zinc-900 hover:bg-zinc-50 flex items-center justify-center gap-3 py-3 px-4 rounded-lg shadow-sm"
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign in with Google
                    </Button>

                    <Text size="2" color="gray" className="text-center">
                        By signing in, you agree to our terms of service and
                        privacy policy
                    </Text>
                </Flex>
            </div>
        </div>
    )
}
