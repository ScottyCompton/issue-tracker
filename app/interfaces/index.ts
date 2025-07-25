import { Status, User } from '@/app/generated/prisma'

export interface Issue {
    id: number,
    title: string,
    status: Status,
    createdAt: Date,
    updatedAt: Date
    assignedToUserId?: String
    assignedToUser?: User
}
