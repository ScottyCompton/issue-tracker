import {
    createProjectSchema,
    issueSchema,
    updateIssueAssigneeSchema,
    updateIssueSchema,
    updateProjectSchema,
} from '@/app/schemas/validationSchemas'
import prisma, { IssueType } from '@/prisma/client'

export const resolvers = {
    Query: {
        issues: async (_: any, args: any) => {
            const where: any = {}

            if (args.status) {
                where.status = args.status
            }

            if (args.issueType) {
                where.issueType = args.issueType
            }

            if (args.assignedToUserId) {
                where.assignedToUserId = args.assignedToUserId
            }

            if (args.projectId) {
                where.projectId = parseInt(args.projectId)
            }

            const paging = args.paging || {}
            const { skip, take } = paging

            return await prisma.issue.findMany({
                where,
                orderBy: args.orderBy,
                skip: skip,
                take: take,
                include: {
                    project: true,
                    assignedToUser: true,
                },
            })
        },

        latestIssues: async (_: any, args: any) => {
            const where: any = {}

            if (args.projectId) {
                where.projectId = parseInt(args.projectId)
            }

            return await prisma.issue.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    assignedToUser: true,
                    project: true,
                },
            })
        },

        issuesCount: async (_: any, args: any) => {
            const where: any = {}
            if (args.status) {
                where.status = args.status
            }
            if (args.issueType) {
                where.issueType = args.issueType
            }
            if (args.assignedToUserId) {
                where.assignedToUserId = args.assignedToUserId
            }
            if (args.projectId) {
                where.projectId = parseInt(args.projectId)
            }
            return await prisma.issue.count({
                where,
            })
        },

        issueStatusCount: async (_: any, args: any) => {
            const aryOut: { label: string; status: string; count: number }[] =
                []
            let issuesCount

            console.log('args.includeAll =', args.includeAll)

            const where: any = {}
            if (args.projectId) {
                where.projectId = parseInt(args.projectId)
            }

            if (args.includeAll) {
                issuesCount = await prisma.issue.count({ where })
                aryOut.push({ label: 'All', status: '', count: issuesCount })
            }

            issuesCount = await prisma.issue.count({
                where: {
                    ...where,
                    status: 'OPEN',
                },
            })

            aryOut.push({ label: 'Open', status: 'OPEN', count: issuesCount })

            issuesCount = await prisma.issue.count({
                where: {
                    ...where,
                    status: 'IN_PROGRESS',
                },
            })
            aryOut.push({
                label: 'In Progress',
                status: 'IN_PROGRESS',
                count: issuesCount,
            })

            issuesCount = await prisma.issue.count({
                where: {
                    ...where,
                    status: 'CLOSED',
                },
            })
            aryOut.push({
                label: 'Closed',
                status: 'CLOSED',
                count: issuesCount,
            })

            return aryOut
        },

        issue: async (_: any, { id }: { id: string }) => {
            return await prisma.issue.findUnique({
                where: { id: parseInt(id) },
                include: {
                    project: true,
                    assignedToUser: true,
                },
            })
        },

        users: async () => {
            const users = await prisma.user.findMany()
            return users
        },

        projects: async () => {
            return await prisma.project.findMany({
                orderBy: { name: 'asc' },
            })
        },

        project: async (_: any, { id }: { id: string }) => {
            return await prisma.project.findUnique({
                where: { id: parseInt(id) },
            })
        },

        projectSummary: async () => {
            const projects = await prisma.project.findMany({
                orderBy: { name: 'asc' },
            })

            const projectSummaries = await Promise.all(
                projects.map(async (project) => {
                    const issueCount = await prisma.issue.count({
                        where: { projectId: project.id },
                    })

                    return {
                        id: project.id.toString(),
                        name: project.name,
                        issueCount,
                    }
                })
            )

            return projectSummaries
        },
    },

    Mutation: {
        createIssue: async (
            _: any,
            { input }: { input: any }
        ) => {
            // Validate input
            const validation = issueSchema.safeParse(input)
            if (!validation.success) {
                throw new Error('Invalid input data')
            }

            const data: any = {
                title: input.title,
                description: input.description,
                issueType: input.issueType || 'GENERAL',
            }

            // Default project assignment logic
            if (input.projectId) {
                // Validate that the specified project exists
                const project = await prisma.project.findUnique({
                    where: { id: parseInt(input.projectId) },
                })
                if (!project) {
                    throw new Error('Invalid projectId')
                }
                data.projectId = parseInt(input.projectId)
            } else {
                // Assign to default project (first project) if no project specified
                const defaultProject = await prisma.project.findFirst({
                    orderBy: { id: 'asc' },
                })
                if (defaultProject) {
                    data.projectId = defaultProject.id
                }
                // If no projects exist, projectId remains null (unassigned)
            }

            return await prisma.issue.create({
                data,
                include: {
                    project: true,
                    assignedToUser: true,
                },
            })
        },

        updateIssueAssignee: async (
            _: any,
            { id, input }: { id: string; input: any }
        ) => {
            const validation = updateIssueAssigneeSchema.safeParse(input)

            if (!validation.success) {
                throw new Error('Invalid input')
            }

            const issue = await prisma.issue.findUnique({
                where: { id: parseInt(id) },
            })

            if (!issue) {
                throw new Error('Issue not found')
            }

            const { assignedToUserId } = input
            if (assignedToUserId) {
                const user = await prisma.user.findUnique({
                    where: { id: assignedToUserId },
                })

                if (!user) {
                    throw new Error('Invalid assignedToUserId')
                }
            }

            return await prisma.issue.update({
                where: { id: parseInt(id) },
                data: input,
                include: {
                    project: true,
                    assignedToUser: true,
                },
            })
        },

        updateIssue: async (
            _: any,
            { id, input }: { id: string; input: any }
        ) => {
            // Validate input
            const validation = updateIssueSchema.safeParse(input)
            if (!validation.success) {
                throw new Error('Invalid input data')
            }

            const issue = await prisma.issue.findUnique({
                where: { id: parseInt(id) },
            })

            if (!issue) {
                throw new Error('Issue not found')
            }

            const { assignedToUserId, projectId } = input
            
            // Validate assignedToUserId if provided
            if (assignedToUserId) {
                const user = await prisma.user.findUnique({
                    where: { id: assignedToUserId },
                })

                if (!user) {
                    throw new Error('Invalid assignedToUserId')
                }
            }

            // Enhanced project validation
            if (projectId !== undefined) {
                if (projectId === null) {
                    // Allow unassigning from project (setting to null)
                    // No validation needed
                } else {
                    // Validate that the specified project exists
                    const project = await prisma.project.findUnique({
                        where: { id: parseInt(projectId) },
                    })

                    if (!project) {
                        throw new Error('Invalid projectId')
                    }
                }
            }

            const updateData: any = { ...input }
            if (projectId !== undefined) {
                updateData.projectId = projectId ? parseInt(projectId) : null
            }

            return await prisma.issue.update({
                where: { id: parseInt(id) },
                data: updateData,
                include: {
                    project: true,
                    assignedToUser: true,
                },
            })
        },

        deleteIssue: async (_: any, { id }: { id: string }) => {
            const issue = await prisma.issue.findUnique({
                where: { id: parseInt(id) },
            })

            if (!issue) {
                throw new Error('Issue not found')
            }

            await prisma.issue.delete({
                where: { id: parseInt(id) },
            })

            return true
        },

        createProject: async (
            _: any,
            { input }: { input: { name: string; description?: string } }
        ) => {
            const validation = createProjectSchema.safeParse(input)
            if (!validation.success) {
                throw new Error('Invalid project data')
            }

            // Check for duplicate project name
            const existingProject = await prisma.project.findFirst({
                where: {
                    name: input.name.trim(),
                },
            })

            if (existingProject) {
                throw new Error(`A project with the name "${input.name.trim()}" already exists`)
            }

            return await prisma.project.create({
                data: {
                    name: input.name.trim(),
                    description: input.description?.trim() || null,
                },
            })
        },

        updateProject: async (
            _: any,
            {
                id,
                input,
            }: { id: string; input: { name?: string; description?: string } }
        ) => {
            const validation = updateProjectSchema.safeParse(input)
            if (!validation.success) {
                throw new Error('Invalid project data')
            }

            const project = await prisma.project.findUnique({
                where: { id: parseInt(id) },
            })

            if (!project) {
                throw new Error('Project not found')
            }

            // Check for duplicate project name if name is being updated
            if (input.name !== undefined) {
                const existingProject = await prisma.project.findFirst({
                    where: {
                        name: input.name.trim(),
                        id: {
                            not: parseInt(id), // Exclude current project from check
                        },
                    },
                })

                if (existingProject) {
                    throw new Error(`A project with the name "${input.name.trim()}" already exists`)
                }
            }

            const updateData: any = {}
            if (input.name !== undefined) {
                updateData.name = input.name.trim()
            }

            if (input.description !== undefined) {
                updateData.description = input.description?.trim() || null
            }

            return await prisma.project.update({
                where: { id: parseInt(id) },
                data: updateData,
            })
        },

        deleteProject: async (_: any, { id }: { id: string }) => {
            const project = await prisma.project.findUnique({
                where: { id: parseInt(id) },
            })

            if (!project) {
                throw new Error('Project not found')
            }

            // Check if project has assigned issues
            const issueCount = await prisma.issue.count({
                where: { projectId: parseInt(id) },
            })

            if (issueCount > 0) {
                throw new Error(
                    `Cannot delete project "${project.name}". It has ${issueCount} assigned issue(s). Please reassign all issues to another project before deleting this project.`
                )
            }

            await prisma.project.delete({
                where: { id: parseInt(id) },
            })

            return true
        },
    },
}
