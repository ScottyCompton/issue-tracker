import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/api/graphql',
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
}) 