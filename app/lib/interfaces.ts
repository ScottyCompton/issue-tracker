import { issue_issueType, issue_status, user } from '@/app/generated/prisma'

export interface Issue {
    id: number
    title: string
    status: issue_status
    issueType: issue_issueType
    createdAt: Date
    updatedAt: Date
    assignedToUserId?: String
    assignedToUser?: user
    projectId?: number | null
    project?: {
        id: number
        name: string
        description?: string | null
    } | null
}
