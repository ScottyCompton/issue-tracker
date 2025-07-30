import { z } from 'zod'

export const issueSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(65536).min(1, 'Description is required'),
})

export const updateIssueSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255).optional(),
    description: z
        .string()
        .max(65536)
        .min(1, 'Description is required')
        .optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']).optional(),
    assignedToUserId: z
        .string()
        .max(255)
        .min(1, 'assignedToUserId is required')
        .optional()
        .nullable(),
})

export const updateIssueAssigneeSchema = z.object({
    assignedToUserId: z
        .string()
        .max(255)
        .min(1, 'assignedToUserId is required')
        .optional()
        .nullable(),
})
