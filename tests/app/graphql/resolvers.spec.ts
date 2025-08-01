import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the validation schemas
vi.mock('@/app/schemas/validationSchemas', () => ({
    issueSchema: {
        safeParse: vi.fn(),
    },
    updateIssueSchema: {
        safeParse: vi.fn(),
    },
    updateIssueAssigneeSchema: {
        safeParse: vi.fn(),
    },
}))

// Mock Prisma client
vi.mock('@/prisma/client', () => ({
    default: {
        issue: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        },
        user: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}))

// Import after mocks are set up
import { resolvers } from '@/app/graphql/resolvers'
import {
    issueSchema,
    updateIssueAssigneeSchema,
    updateIssueSchema,
} from '@/app/schemas/validationSchemas'
import prisma from '@/prisma/client'

// Type the mocked functions
const mockPrisma = prisma as any

describe('GraphQL Resolvers', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Query Resolvers', () => {
        describe('issues', () => {
            it('should return issues with default parameters', async () => {
                const mockIssues = [
                    { id: 1, title: 'Issue 1', status: 'OPEN' },
                    { id: 2, title: 'Issue 2', status: 'CLOSED' },
                ]

                mockPrisma.issue.findMany.mockResolvedValue(mockIssues)

                const result = await resolvers.Query.issues(
                    {},
                    {
                        paging: { skip: 0, take: 10 },
                        orderBy: { createdAt: 'desc' },
                    }
                )

                expect(result).toEqual(mockIssues)
                expect(mockPrisma.issue.findMany).toHaveBeenCalledWith({
                    where: {},
                    orderBy: { createdAt: 'desc' },
                    skip: 0,
                    take: 10,
                })
            })

            it('should filter issues by status', async () => {
                const mockIssues = [
                    { id: 1, title: 'Open Issue', status: 'OPEN' },
                ]

                mockPrisma.issue.findMany.mockResolvedValue(mockIssues)

                const result = await resolvers.Query.issues(
                    {},
                    {
                        status: 'OPEN',
                        paging: { skip: 0, take: 10 },
                    }
                )

                expect(result).toEqual(mockIssues)
                expect(mockPrisma.issue.findMany).toHaveBeenCalledWith({
                    where: { status: 'OPEN' },
                    orderBy: undefined,
                    skip: 0,
                    take: 10,
                })
            })
        })

        describe('latestIssues', () => {
            it('should return latest 5 issues with assigned users', async () => {
                const mockIssues = [
                    {
                        id: 1,
                        title: 'Latest Issue 1',
                        status: 'OPEN',
                        assignedToUser: {
                            id: 'user1',
                            name: 'John Doe',
                            email: 'john@example.com',
                        },
                    },
                    {
                        id: 2,
                        title: 'Latest Issue 2',
                        status: 'IN_PROGRESS',
                        assignedToUser: null,
                    },
                ]

                mockPrisma.issue.findMany.mockResolvedValue(mockIssues)

                const result = await resolvers.Query.latestIssues()

                expect(result).toEqual(mockIssues)
                expect(mockPrisma.issue.findMany).toHaveBeenCalledWith({
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        assignedToUser: true,
                    },
                })
            })
        })

        describe('issuesCount', () => {
            it('should return total count when no status filter', async () => {
                mockPrisma.issue.count.mockResolvedValue(10)

                const result = await resolvers.Query.issuesCount({}, {})

                expect(result).toBe(10)
                expect(mockPrisma.issue.count).toHaveBeenCalledWith({
                    where: {},
                })
            })

            it('should return count filtered by status', async () => {
                mockPrisma.issue.count.mockResolvedValue(5)

                const result = await resolvers.Query.issuesCount(
                    {},
                    { status: 'OPEN' }
                )

                expect(result).toBe(5)
                expect(mockPrisma.issue.count).toHaveBeenCalledWith({
                    where: { status: 'OPEN' },
                })
            })
        })

        describe('issueStatusCount', () => {
            it('should return status counts without includeAll', async () => {
                mockPrisma.issue.count
                    .mockResolvedValueOnce(3) // OPEN
                    .mockResolvedValueOnce(2) // IN_PROGRESS
                    .mockResolvedValueOnce(1) // CLOSED

                const result = await resolvers.Query.issueStatusCount(
                    {},
                    { includeAll: false }
                )

                expect(result).toEqual([
                    { label: 'Open', status: 'OPEN', count: 3 },
                    { label: 'In Progress', status: 'IN_PROGRESS', count: 2 },
                    { label: 'Closed', status: 'CLOSED', count: 1 },
                ])

                expect(mockPrisma.issue.count).toHaveBeenCalledTimes(3)
            })

            it('should return status counts with includeAll', async () => {
                mockPrisma.issue.count
                    .mockResolvedValueOnce(6) // Total count
                    .mockResolvedValueOnce(3) // OPEN
                    .mockResolvedValueOnce(2) // IN_PROGRESS
                    .mockResolvedValueOnce(1) // CLOSED

                const result = await resolvers.Query.issueStatusCount(
                    {},
                    { includeAll: true }
                )

                expect(result).toEqual([
                    { label: 'All', status: '', count: 6 },
                    { label: 'Open', status: 'OPEN', count: 3 },
                    { label: 'In Progress', status: 'IN_PROGRESS', count: 2 },
                    { label: 'Closed', status: 'CLOSED', count: 1 },
                ])

                expect(mockPrisma.issue.count).toHaveBeenCalledTimes(4)
            })
        })

        describe('issue', () => {
            it('should return issue by id', async () => {
                const mockIssue = {
                    id: 1,
                    title: 'Test Issue',
                    description: 'Test Description',
                    status: 'OPEN',
                }

                mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)

                const result = await resolvers.Query.issue({}, { id: '1' })

                expect(result).toEqual(mockIssue)
                expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                    where: { id: 1 },
                })
            })

            it('should return null for non-existent issue', async () => {
                mockPrisma.issue.findUnique.mockResolvedValue(null)

                const result = await resolvers.Query.issue({}, { id: '999' })

                expect(result).toBeNull()
                expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                    where: { id: 999 },
                })
            })
        })

        describe('users', () => {
            it('should return all users', async () => {
                const mockUsers = [
                    {
                        id: 'user1',
                        name: 'John Doe',
                        email: 'john@example.com',
                    },
                    {
                        id: 'user2',
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                    },
                ]

                mockPrisma.user.findMany.mockResolvedValue(mockUsers)

                const result = await resolvers.Query.users()

                expect(result).toEqual(mockUsers)
                expect(mockPrisma.user.findMany).toHaveBeenCalledWith()
            })
        })
    })

    describe('Mutation Resolvers', () => {
        describe('createIssue', () => {
            it('should create issue with valid input', async () => {
                const input = {
                    title: 'New Issue',
                    description: 'New Description',
                }
                const mockCreatedIssue = {
                    id: 1,
                    title: 'New Issue',
                    description: 'New Description',
                    status: 'OPEN',
                }

                ;(issueSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.create.mockResolvedValue(mockCreatedIssue)

                const result = await resolvers.Mutation.createIssue(
                    {},
                    { input }
                )

                expect(result).toEqual(mockCreatedIssue)
                expect(issueSchema.safeParse).toHaveBeenCalledWith(input)
                expect(mockPrisma.issue.create).toHaveBeenCalledWith({
                    data: {
                        title: 'New Issue',
                        description: 'New Description',
                    },
                })
            })

            it('should throw error for invalid input', async () => {
                const input = { title: '', description: '' }

                ;(issueSchema.safeParse as any).mockReturnValue({
                    success: false,
                })

                await expect(
                    resolvers.Mutation.createIssue({}, { input })
                ).rejects.toThrow('Invalid input data')

                expect(issueSchema.safeParse).toHaveBeenCalledWith(input)
                expect(mockPrisma.issue.create).not.toHaveBeenCalled()
            })
        })

        describe('updateIssueAssignee', () => {
            it('should update issue assignee with valid input', async () => {
                const input = { assignedToUserId: 'user1' }
                const mockIssue = { id: 1, title: 'Test Issue' }
                const mockUser = { id: 'user1', name: 'John Doe' }
                const mockUpdatedIssue = {
                    ...mockIssue,
                    assignedToUserId: 'user1',
                }

                ;(updateIssueAssigneeSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)
                mockPrisma.user.findUnique.mockResolvedValue(mockUser)
                mockPrisma.issue.update.mockResolvedValue(mockUpdatedIssue)

                const result = await resolvers.Mutation.updateIssueAssignee(
                    {},
                    { id: '1', input }
                )

                expect(result).toEqual(mockUpdatedIssue)
                expect(
                    updateIssueAssigneeSchema.safeParse
                ).toHaveBeenCalledWith(input)
                expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                    where: { id: 1 },
                })
                expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                    where: { id: 'user1' },
                })
                expect(mockPrisma.issue.update).toHaveBeenCalledWith({
                    where: { id: 1 },
                    data: input,
                })
            })

            it('should throw error for invalid input', async () => {
                const input = { assignedToUserId: '' }

                ;(updateIssueAssigneeSchema.safeParse as any).mockReturnValue({
                    success: false,
                })

                await expect(
                    resolvers.Mutation.updateIssueAssignee(
                        {},
                        { id: '1', input }
                    )
                ).rejects.toThrow('Invalid input')

                expect(
                    updateIssueAssigneeSchema.safeParse
                ).toHaveBeenCalledWith(input)
                expect(mockPrisma.issue.findUnique).not.toHaveBeenCalled()
            })

            it('should throw error for non-existent issue', async () => {
                const input = { assignedToUserId: 'user1' }

                ;(updateIssueAssigneeSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.findUnique.mockResolvedValue(null)

                await expect(
                    resolvers.Mutation.updateIssueAssignee(
                        {},
                        { id: '999', input }
                    )
                ).rejects.toThrow('Issue not found')

                expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                    where: { id: 999 },
                })
                expect(mockPrisma.issue.update).not.toHaveBeenCalled()
            })

            it('should throw error for invalid assignedToUserId', async () => {
                const input = { assignedToUserId: 'invalid-user' }
                const mockIssue = { id: 1, title: 'Test Issue' }

                ;(updateIssueAssigneeSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)
                mockPrisma.user.findUnique.mockResolvedValue(null)

                await expect(
                    resolvers.Mutation.updateIssueAssignee(
                        {},
                        { id: '1', input }
                    )
                ).rejects.toThrow('Invalid assignedToUserId')

                expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                    where: { id: 'invalid-user' },
                })
                expect(mockPrisma.issue.update).not.toHaveBeenCalled()
            })

            it('should allow null assignedToUserId', async () => {
                const input = { assignedToUserId: null }
                const mockIssue = { id: 1, title: 'Test Issue' }
                const mockUpdatedIssue = {
                    ...mockIssue,
                    assignedToUserId: null,
                }

                ;(updateIssueAssigneeSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)
                mockPrisma.issue.update.mockResolvedValue(mockUpdatedIssue)

                const result = await resolvers.Mutation.updateIssueAssignee(
                    {},
                    { id: '1', input }
                )

                expect(result).toEqual(mockUpdatedIssue)
                expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
                expect(mockPrisma.issue.update).toHaveBeenCalledWith({
                    where: { id: 1 },
                    data: input,
                })
            })
        })

        describe('updateIssue', () => {
            it('should update issue with valid input', async () => {
                const input = {
                    title: 'Updated Issue',
                    description: 'Updated Description',
                }
                const mockIssue = { id: 1, title: 'Original Issue' }
                const mockUpdatedIssue = { ...mockIssue, ...input }

                ;(updateIssueSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)
                mockPrisma.issue.update.mockResolvedValue(mockUpdatedIssue)

                const result = await resolvers.Mutation.updateIssue(
                    {},
                    { id: '1', input }
                )

                expect(result).toEqual(mockUpdatedIssue)
                expect(updateIssueSchema.safeParse).toHaveBeenCalledWith(input)
                expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                    where: { id: 1 },
                })
                expect(mockPrisma.issue.update).toHaveBeenCalledWith({
                    where: { id: 1 },
                    data: input,
                })
            })

            it('should throw error for invalid input', async () => {
                const input = { title: '', description: '' }

                ;(updateIssueSchema.safeParse as any).mockReturnValue({
                    success: false,
                })

                await expect(
                    resolvers.Mutation.updateIssue({}, { id: '1', input })
                ).rejects.toThrow('Invalid input data')

                expect(updateIssueSchema.safeParse).toHaveBeenCalledWith(input)
                expect(mockPrisma.issue.update).not.toHaveBeenCalled()
            })

            it('should throw error for non-existent issue', async () => {
                const input = { title: 'Updated Issue' }

                ;(updateIssueSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.findUnique.mockResolvedValue(null)

                await expect(
                    resolvers.Mutation.updateIssue({}, { id: '999', input })
                ).rejects.toThrow('Issue not found')

                expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                    where: { id: 999 },
                })
                expect(mockPrisma.issue.update).not.toHaveBeenCalled()
            })

            it('should validate assignedToUserId if provided', async () => {
                const input = {
                    title: 'Updated Issue',
                    assignedToUserId: 'user1',
                }
                const mockIssue = { id: 1, title: 'Original Issue' }
                const mockUser = { id: 'user1', name: 'John Doe' }
                const mockUpdatedIssue = { ...mockIssue, ...input }

                ;(updateIssueSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)
                mockPrisma.user.findUnique.mockResolvedValue(mockUser)
                mockPrisma.issue.update.mockResolvedValue(mockUpdatedIssue)

                const result = await resolvers.Mutation.updateIssue(
                    {},
                    { id: '1', input }
                )

                expect(result).toEqual(mockUpdatedIssue)
                expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                    where: { id: 'user1' },
                })
            })

            it('should throw error for invalid assignedToUserId', async () => {
                const input = {
                    title: 'Updated Issue',
                    assignedToUserId: 'invalid-user',
                }
                const mockIssue = { id: 1, title: 'Original Issue' }

                ;(updateIssueSchema.safeParse as any).mockReturnValue({
                    success: true,
                    data: input,
                })
                mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)
                mockPrisma.user.findUnique.mockResolvedValue(null)

                await expect(
                    resolvers.Mutation.updateIssue({}, { id: '1', input })
                ).rejects.toThrow('Invalid assignedToUserId')

                expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                    where: { id: 'invalid-user' },
                })
                expect(mockPrisma.issue.update).not.toHaveBeenCalled()
            })
        })

        describe('deleteIssue', () => {
            it('should delete existing issue', async () => {
                const mockIssue = { id: 1, title: 'Issue to Delete' }

                mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)
                mockPrisma.issue.delete.mockResolvedValue(mockIssue)

                const result = await resolvers.Mutation.deleteIssue(
                    {},
                    { id: '1' }
                )

                expect(result).toBe(true)
                expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                    where: { id: 1 },
                })
                expect(mockPrisma.issue.delete).toHaveBeenCalledWith({
                    where: { id: 1 },
                })
            })

            it('should throw error for non-existent issue', async () => {
                mockPrisma.issue.findUnique.mockResolvedValue(null)

                await expect(
                    resolvers.Mutation.deleteIssue({}, { id: '999' })
                ).rejects.toThrow('Issue not found')

                expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({
                    where: { id: 999 },
                })
                expect(mockPrisma.issue.delete).not.toHaveBeenCalled()
            })
        })
    })

    describe('Error Handling', () => {
        it('should handle Prisma errors gracefully', async () => {
            mockPrisma.issue.findMany.mockRejectedValue(
                new Error('Database connection failed')
            )

            await expect(
                resolvers.Query.issues({}, { paging: { skip: 0, take: 10 } })
            ).rejects.toThrow('Database connection failed')
        })

        it('should handle validation errors properly', async () => {
            const input = { title: '', description: '' }

            ;(issueSchema.safeParse as any).mockReturnValue({ success: false })

            await expect(
                resolvers.Mutation.createIssue({}, { input })
            ).rejects.toThrow('Invalid input data')
        })
    })

    describe('Input Validation', () => {
        it('should validate all required fields for createIssue', async () => {
            const input = {
                title: 'Valid Title',
                description: 'Valid Description',
            }

            ;(issueSchema.safeParse as any).mockReturnValue({
                success: true,
                data: input,
            })
            mockPrisma.issue.create.mockResolvedValue({ id: 1, ...input })

            const result = await resolvers.Mutation.createIssue({}, { input })

            expect(result).toBeDefined()
            expect(issueSchema.safeParse).toHaveBeenCalledWith(input)
        })

        it('should validate assignee updates properly', async () => {
            const input = { assignedToUserId: 'user1' }
            const mockIssue = { id: 1, title: 'Test Issue' }
            const mockUser = { id: 'user1', name: 'John Doe' }

            ;(updateIssueAssigneeSchema.safeParse as any).mockReturnValue({
                success: true,
                data: input,
            })
            mockPrisma.issue.findUnique.mockResolvedValue(mockIssue)
            mockPrisma.user.findUnique.mockResolvedValue(mockUser)
            mockPrisma.issue.update.mockResolvedValue({
                ...mockIssue,
                ...input,
            })

            const result = await resolvers.Mutation.updateIssueAssignee(
                {},
                { id: '1', input }
            )

            expect(result).toBeDefined()
            expect(updateIssueAssigneeSchema.safeParse).toHaveBeenCalledWith(
                input
            )
        })
    })

    describe('User Filtering', () => {
        it('should filter issues by assignedToUserId when provided', async () => {
            const mockIssues = [
                { id: 1, title: 'Issue 1', assignedToUserId: 'user1' },
                { id: 2, title: 'Issue 2', assignedToUserId: 'user2' },
            ]

            mockPrisma.issue.findMany.mockResolvedValue(mockIssues)

            const result = await resolvers.Query.issues(null, {
                assignedToUserId: 'user1',
                paging: { skip: 0, take: 10 },
            })

            expect(mockPrisma.issue.findMany).toHaveBeenCalledWith({
                where: {
                    assignedToUserId: 'user1',
                },
                orderBy: undefined,
                skip: 0,
                take: 10,
            })

            expect(result).toEqual(mockIssues)
        })

        it('should not filter by assignedToUserId when not provided', async () => {
            const mockIssues = [
                { id: 1, title: 'Issue 1', assignedToUserId: 'user1' },
                { id: 2, title: 'Issue 2', assignedToUserId: 'user2' },
            ]

            mockPrisma.issue.findMany.mockResolvedValue(mockIssues)

            const result = await resolvers.Query.issues(null, {
                paging: { skip: 0, take: 10 },
            })

            expect(mockPrisma.issue.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: undefined,
                skip: 0,
                take: 10,
            })

            expect(result).toEqual(mockIssues)
        })

        it('should combine status and assignedToUserId filters', async () => {
            const mockIssues = [
                {
                    id: 1,
                    title: 'Issue 1',
                    status: 'OPEN',
                    assignedToUserId: 'user1',
                },
            ]

            mockPrisma.issue.findMany.mockResolvedValue(mockIssues)

            const result = await resolvers.Query.issues(null, {
                status: 'OPEN',
                assignedToUserId: 'user1',
                paging: { skip: 0, take: 10 },
            })

            expect(mockPrisma.issue.findMany).toHaveBeenCalledWith({
                where: {
                    status: 'OPEN',
                    assignedToUserId: 'user1',
                },
                orderBy: undefined,
                skip: 0,
                take: 10,
            })

            expect(result).toEqual(mockIssues)
        })

        it('should count issues by assignedToUserId when provided', async () => {
            mockPrisma.issue.count.mockResolvedValue(5)

            const result = await resolvers.Query.issuesCount(null, {
                assignedToUserId: 'user1',
            })

            expect(mockPrisma.issue.count).toHaveBeenCalledWith({
                where: {
                    assignedToUserId: 'user1',
                },
            })

            expect(result).toBe(5)
        })

        it('should count issues by status and assignedToUserId when both provided', async () => {
            mockPrisma.issue.count.mockResolvedValue(3)

            const result = await resolvers.Query.issuesCount(null, {
                status: 'OPEN',
                assignedToUserId: 'user1',
            })

            expect(mockPrisma.issue.count).toHaveBeenCalledWith({
                where: {
                    status: 'OPEN',
                    assignedToUserId: 'user1',
                },
            })

            expect(result).toBe(3)
        })
    })
})
