import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs } from '@/app/graphql/schema'
import { resolvers } from '@/app/graphql/resolvers'
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

export { handler as GET, handler as POST } 