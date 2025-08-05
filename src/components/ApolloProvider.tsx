'use client'

import { client } from '@/lib/apollo-client'
import { ApolloProvider as Provider } from '@apollo/client'

interface ApolloProviderProps {
    children: React.ReactNode
}

export function ApolloProvider({ children }: ApolloProviderProps) {
    return <Provider client={client}>{children}</Provider>
}
