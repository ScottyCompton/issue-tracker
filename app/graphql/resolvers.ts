import prisma from "@/prisma/client"
import { issueSchema, updateIssueAssigneeSchema } from "@/app/schemas/validationSchemas"

export const resolvers = {
  Query: {
    issues: async (_:any, args: any) => {
      const where: any = {}
      
      if (args.status) {
        where.status = args.status
      }
      const {skip, take} = args.paging
      return await prisma.issue.findMany({
        where,
        orderBy: args.orderBy,
        skip: args.paging.skip,
        take: args.paging.take
      })
    },

    latestIssues: async () => {
      return await prisma.issue.findMany({
        orderBy: {createdAt: 'desc'},
        take: 5,
        include: {
          assignedToUser: true
        }
      })
      
    },
    
    issuesCount: async(_:any, args: any) => {
      const where: any = {}
      if(args.status) {
        where.status = args.status
      }
      return await prisma.issue.count({
        where
      })
    },

    issue: async (_: any, { id }: { id: string }) => {
      return await prisma.issue.findUnique({
        where: { id: parseInt(id) }
      })
    },

    users: async () => {
      const users = await prisma.user.findMany()
      console.log('Available users:', users.map(user => ({ id: user.id, name: user.name })))
      return users
    },

  },

  Mutation: {
    createIssue: async (_: any, { input }: { input: { title: string; description: string } }) => {
      // Validate input
      const validation = issueSchema.safeParse(input)
      if (!validation.success) {
        throw new Error('Invalid input data')
      }

      return await prisma.issue.create({
        data: {
          title: input.title,
          description: input.description
        }
      })
    },

    updateIssueAssignee: async(_: any, {id, input}: {id: string, input: any}) => {
      const validation = updateIssueAssigneeSchema.safeParse(input)

      if(!validation.success) {
        throw new Error('Invalid input')
      }

      const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
      })
            
      if (!issue) {
        throw new Error('Issue not found')
      }

      const { assignedToUserId }  = input
      if (assignedToUserId) {
        const user = await prisma.user.findUnique({
          where: { id: assignedToUserId }
        })
        
        if(!user) {
          throw new Error('Invalid assignedToUserId')
        }
      }

      return await prisma.issue.update({
        where: { id: parseInt(id) },
        data: input
      })

    },

    updateIssue: async (_: any, { id, input }: { id: string; input: any }) => {
      // Validate input
      const validation = issueSchema.safeParse(input)
      if (!validation.success) {
        throw new Error('Invalid input data')
      }

      const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
      })

      const { assignedToUserId }  = input
      if (assignedToUserId) {
        const user = await prisma.user.findUnique({
          where: { id: assignedToUserId }
        })
        
        if(!user) {
          throw new Error('Invalid assignedToUserId')
        }
      }

      if (!issue) {
        throw new Error('Issue not found')
      }

      return await prisma.issue.update({
        where: { id: parseInt(id) },
        data: input
      })
    },

    deleteIssue: async (_: any, { id }: { id: string }) => {
      const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
      })

      if (!issue) {
        throw new Error('Issue not found')
      }

      await prisma.issue.delete({
        where: { id: parseInt(id) }
      })

      return true
    }
  }
} 