import { User } from '@/app/generated/prisma'
import { IssueType, Status } from '@/prisma/client'

export interface Issue {
    id: number
    title: string
    status: Status
    issueType: IssueType
    createdAt: Date
    updatedAt: Date
    assignedToUserId?: String
    assignedToUser?: User
}
