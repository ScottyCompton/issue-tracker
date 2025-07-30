import { PrismaClient } from '@/app/generated/prisma'


const prismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = global as unknown as {
    prisma: PrismaClientSingleton | undefined
}

export type Status = 'OPEN' | 'IN_PROGRESS' | 'CLOSED'

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
