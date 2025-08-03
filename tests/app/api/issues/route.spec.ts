import { NextRequest, NextResponse } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock NextAuth
const mockGetServerSession = vi.fn()
vi.mock('next-auth', () => ({
    getServerSession: mockGetServerSession,
}))

// Mock Prisma client
const mockPrisma = {
    issue: {
        create: vi.fn(),
    },
}
vi.mock('@/prisma/client', () => ({
    default: mockPrisma,
}))

// Mock validation schemas
const mockIssueSchema = {
    safeParse: vi.fn(),
}
vi.mock('@/app/schemas/validationSchemas', () => ({
    issueSchema: mockIssueSchema,
}))

// Mock auth options
vi.mock('@/app/auth/authOptions', () => ({
    default: {},
}))

describe('POST /api/issues', () => {
    let POST: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the route handler
        const module = await import('@/app/api/issues/route')
        POST = module.POST
    })

    const mockRequest = (body: any) => {
        return {
            json: vi.fn().mockResolvedValue(body),
        } as unknown as NextRequest
    }

    const mockValidIssue = {
        title: 'Test Issue',
        description: 'Test description',
        projectId: '1',
    }

    const mockCreatedIssue = {
        id: 1,
        title: 'Test Issue',
        description: 'Test description',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedToUserId: null,
    }

    it('can be imported successfully', () => {
        expect(POST).toBeDefined()
        expect(typeof POST).toBe('function')
    })

    it('creates a new issue successfully', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful validation
        mockIssueSchema.safeParse.mockReturnValue({
            success: true,
            data: mockValidIssue,
        })

        // Mock successful database creation
        mockPrisma.issue.create.mockResolvedValue(mockCreatedIssue)

        const request = mockRequest(mockValidIssue)
        const response = await POST(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(201)

        const responseData = await response.json()
        expect(responseData).toEqual(mockCreatedIssue)
        expect(mockPrisma.issue.create).toHaveBeenCalledWith({
            data: {
                title: mockValidIssue.title,
                description: mockValidIssue.description,
                projectId: 1,
            },
        })
    })

    it('returns 401 when user is not authenticated', async () => {
        // Mock unauthenticated session
        mockGetServerSession.mockResolvedValue(null)

        const request = mockRequest(mockValidIssue)
        const response = await POST(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(401)

        const responseData = await response.json()
        expect(responseData).toEqual({})
    })

    it('returns 400 when validation fails', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock validation failure
        const validationErrors = {
            _errors: ['Title is required'],
            title: { _errors: ['Title is required'] },
        }
        mockIssueSchema.safeParse.mockReturnValue({
            success: false,
            error: { format: () => validationErrors },
        })

        const request = mockRequest({ title: '', description: '' })
        const response = await POST(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(400)

        const responseData = await response.json()
        expect(responseData).toEqual(validationErrors)
    })

    it('handles database errors gracefully', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful validation
        mockIssueSchema.safeParse.mockReturnValue({
            success: true,
            data: mockValidIssue,
        })

        // Mock database error
        mockPrisma.issue.create.mockRejectedValue(new Error('Database error'))

        const request = mockRequest(mockValidIssue)

        await expect(POST(request)).rejects.toThrow('Database error')
    })

    it('validates request body structure', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock validation failure for invalid structure
        const validationErrors = {
            _errors: ['Invalid data structure'],
        }
        mockIssueSchema.safeParse.mockReturnValue({
            success: false,
            error: { format: () => validationErrors },
        })

        const request = mockRequest({ invalidField: 'value' })
        const response = await POST(request)

        expect(response.status).toBe(400)

        const responseData = await response.json()
        expect(responseData).toEqual(validationErrors)
    })

    it('creates issue without projectId', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        const issueWithoutProject = {
            title: 'Test Issue',
            description: 'Test description',
        }

        // Mock successful validation
        mockIssueSchema.safeParse.mockReturnValue({
            success: true,
            data: issueWithoutProject,
        })

        // Mock successful database creation
        mockPrisma.issue.create.mockResolvedValue({
            ...mockCreatedIssue,
            projectId: null,
        })

        const request = mockRequest(issueWithoutProject)
        const response = await POST(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(201)

        expect(mockPrisma.issue.create).toHaveBeenCalledWith({
            data: {
                title: issueWithoutProject.title,
                description: issueWithoutProject.description,
                projectId: null,
            },
        })
    })

    it('handles empty request body', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock validation failure for empty body
        const validationErrors = {
            _errors: ['Request body is required'],
        }
        mockIssueSchema.safeParse.mockReturnValue({
            success: false,
            error: { format: () => validationErrors },
        })

        const request = mockRequest({})
        const response = await POST(request)

        expect(response.status).toBe(400)

        const responseData = await response.json()
        expect(responseData).toEqual(validationErrors)
    })

    it('creates issue with minimal required fields', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful validation
        mockIssueSchema.safeParse.mockReturnValue({
            success: true,
            data: { title: 'Minimal Issue' },
        })

        // Mock successful database creation
        const minimalIssue = {
            id: 2,
            title: 'Minimal Issue',
            description: null,
            status: 'OPEN',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assignedToUserId: null,
        }
        mockPrisma.issue.create.mockResolvedValue(minimalIssue)

        const request = mockRequest({ title: 'Minimal Issue' })
        const response = await POST(request)

        expect(response.status).toBe(201)

        const responseData = await response.json()
        expect(responseData).toEqual(minimalIssue)
    })

    it('calls prisma with correct data structure', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful validation
        mockIssueSchema.safeParse.mockReturnValue({
            success: true,
            data: mockValidIssue,
        })

        // Mock successful database creation
        mockPrisma.issue.create.mockResolvedValue(mockCreatedIssue)

        const request = mockRequest(mockValidIssue)
        await POST(request)

        expect(mockPrisma.issue.create).toHaveBeenCalledWith({
            data: {
                title: mockValidIssue.title,
                description: mockValidIssue.description,
                projectId: 1,
            },
        })
    })

    it('handles malformed JSON in request body', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock request with malformed JSON
        const request = {
            json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        } as unknown as NextRequest

        await expect(POST(request)).rejects.toThrow('Invalid JSON')
    })

    it('validates authentication before processing request', async () => {
        // Mock unauthenticated session
        mockGetServerSession.mockResolvedValue(null)

        const request = mockRequest(mockValidIssue)
        const response = await POST(request)

        expect(response.status).toBe(401)

        // Verify that validation and database calls are not made
        expect(mockIssueSchema.safeParse).not.toHaveBeenCalled()
        expect(mockPrisma.issue.create).not.toHaveBeenCalled()
    })

    it('returns correct response headers', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful validation
        mockIssueSchema.safeParse.mockReturnValue({
            success: true,
            data: mockValidIssue,
        })

        // Mock successful database creation
        mockPrisma.issue.create.mockResolvedValue(mockCreatedIssue)

        const request = mockRequest(mockValidIssue)
        const response = await POST(request)

        expect(response.status).toBe(201)
        expect(response.headers.get('content-type')).toBe('application/json')
    })
})
