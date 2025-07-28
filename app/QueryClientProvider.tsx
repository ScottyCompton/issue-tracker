'use client'

import {
    QueryClient,
    QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query'
import { PropsWithChildren, useRef } from 'react'

interface QueryClientProviderProps extends PropsWithChildren {
    client?: QueryClient
}

const QueryClientProvider = ({
    children,
    client,
}: QueryClientProviderProps) => {
    // Memoize the default QueryClient instance for singleton behavior
    const defaultClientRef = useRef<QueryClient | undefined>(undefined)
    if (!defaultClientRef.current) {
        defaultClientRef.current = new QueryClient()
    }
    const queryClient = client ?? defaultClientRef.current
    return (
        <ReactQueryClientProvider client={queryClient}>
            {children}
        </ReactQueryClientProvider>
    )
}

export default QueryClientProvider
