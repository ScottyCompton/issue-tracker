import { z } from 'zod'

export const issueSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(65536).min(1, 'Description is required'),
    issueType: z.enum(['GENERAL', 'BUG', 'SPIKE', 'TASK', 'SUBTASK']),
    projectId: z.string().optional(),
})

export const updateIssueSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255).optional(),
    description: z
        .string()
        .max(65536)
        .min(1, 'Description is required')
        .optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']).optional(),
    issueType: z
        .enum(['GENERAL', 'BUG', 'SPIKE', 'TASK', 'SUBTASK'])
        .optional(),
    assignedToUserId: z
        .string()
        .max(255)
        .min(1, 'assignedToUserId is required')
        .optional()
        .nullable(),
    projectId: z.string().optional(),
})

export const updateIssueAssigneeSchema = z.object({
    assignedToUserId: z
        .string()
        .max(255)
        .min(1, 'assignedToUserId is required')
        .optional()
        .nullable(),
})

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(255),
    description: z.string().max(65536).optional(),
})

export const updateProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(255).optional(),
    description: z.string().max(65536).optional(),
})
