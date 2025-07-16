import { PrismaClient } from "@/app/generated/prisma";

const prismaClientSingleton = () => {
    return new PrismaClient()
}


type prismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: prismaClientSingleton | undefined
}

const prisma = globalForPrisma ?? prismaClientSingleton

export default prisma
