import { resolvers } from '@/app/graphql/resolvers'
import { typeDefs } from '@/app/graphql/schema'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => {
        return { req }
    },
})

// Type the handlers to match Next.js API route expectations
export const GET = handler as any
export const POST = handler as any
