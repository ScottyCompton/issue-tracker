import { User } from '@/app/generated/prisma'
import { Status } from '@/prisma/client'

export interface Issue {
    id: number,
    title: string,
    status: Status,
    createdAt: Date,
    updatedAt: Date
    assignedToUserId?: String
    assignedToUser?: User
}
