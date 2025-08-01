import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const httpLink = createHttpLink({
    uri: `${API_URL}/api/graphql`,
})

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
            fetchPolicy: 'cache-and-network',
        },
        query: {
            errorPolicy: 'all',
            fetchPolicy: 'cache-first',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
})
