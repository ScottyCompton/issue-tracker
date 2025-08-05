import { resolvers } from '@/lib/graphql/resolvers'
import { typeDefs } from '@/lib/graphql/schema'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
})

const handler = startServerAndCreateNextHandler(server, {
    context: async (req, res) => ({
        req,
        res,
    }),
})

export { handler as GET, handler as POST }
