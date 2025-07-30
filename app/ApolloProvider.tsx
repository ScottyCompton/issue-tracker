'use client'

import { ApolloProvider as ApolloClientProvider } from '@apollo/client'
import { PropsWithChildren, useMemo } from 'react'
import { client } from './lib/graphql-client'

interface ApolloProviderProps extends PropsWithChildren {}

const ApolloProvider = ({ children }: ApolloProviderProps) => {
    // Memoize the client to prevent unnecessary re-renders
    const apolloClient = useMemo(() => client, [])

    return (
        <ApolloClientProvider client={apolloClient}>
            {children}
        </ApolloClientProvider>
    )
}

export default ApolloProvider
