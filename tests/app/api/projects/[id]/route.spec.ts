import { NextRequest, NextResponse } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock NextAuth
const mockGetServerSession = vi.fn()
vi.mock('next-auth', () => ({
    getServerSession: mockGetServerSession,
}))

// Mock Prisma client
const mockPrisma = {
    project: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    issue: {
        count: vi.fn(),
    },
    user: {
        findUnique: vi.fn(),
    },
}
vi.mock('@/prisma/client', () => ({
    default: mockPrisma,
}))

// Mock validation schemas
const mockUpdateProjectSchema = {
    safeParse: vi.fn(),
}
vi.mock('@/app/schemas/validationSchemas', () => ({
    updateProjectSchema: mockUpdateProjectSchema,
}))

// Mock auth options
vi.mock('@/app/auth/authOptions', () => ({
    default: {},
}))

describe('GET /api/projects/[id]', () => {
    let GET: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the route handler
        const module = await import('@/app/api/projects/[id]/route')
        GET = module.GET
    })

    const mockRequest = () => {
        return {} as NextRequest
    }

    const mockProject = {
        id: 1,
        name: 'Test Project',
        description: 'Test description',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    it('can be imported successfully', () => {
        expect(GET).toBeDefined()
        expect(typeof GET).toBe('function')
    })

    it('returns project successfully', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful database query
        mockPrisma.project.findUnique.mockResolvedValue(mockProject)

        const request = mockRequest()
        const params = Promise.resolve({ id: '1' })
        const response = await GET(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(200)

        const responseData = await response.json()
        expect(responseData).toEqual(mockProject)
        expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        })
    })

    it('returns 401 when user is not authenticated', async () => {
        // Mock unauthenticated session
        mockGetServerSession.mockResolvedValue(null)

        const request = mockRequest()
        const params = Promise.resolve({ id: '1' })
        const response = await GET(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(401)
    })

    it('returns 404 when project not found', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock project not found
        mockPrisma.project.findUnique.mockResolvedValue(null)

        const request = mockRequest()
        const params = Promise.resolve({ id: '999' })
        const response = await GET(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(404)

        const responseData = await response.json()
        expect(responseData).toEqual({ error: 'Project not found' })
    })
})

describe('PUT /api/projects/[id]', () => {
    let PUT: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the route handler
        const module = await import('@/app/api/projects/[id]/route')
        PUT = module.PUT
    })

    const mockRequest = (body: any) => {
        return {
            json: vi.fn().mockResolvedValue(body),
        } as unknown as NextRequest
    }

    const mockValidProject = {
        name: 'Updated Project',
        description: 'Updated description',
    }

    const mockUpdatedProject = {
        id: 1,
        name: 'Updated Project',
        description: 'Updated description',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    it('can be imported successfully', () => {
        expect(PUT).toBeDefined()
        expect(typeof PUT).toBe('function')
    })

    it('updates project successfully', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful validation
        mockUpdateProjectSchema.safeParse.mockReturnValue({
            success: true,
            data: mockValidProject,
        })

        // Mock project exists
        mockPrisma.project.findUnique.mockResolvedValue(mockUpdatedProject)

        // Mock no duplicate project found
        mockPrisma.project.findFirst.mockResolvedValue(null)

        // Mock successful database update
        mockPrisma.project.update.mockResolvedValue(mockUpdatedProject)

        const request = mockRequest(mockValidProject)
        const params = Promise.resolve({ id: '1' })
        const response = await PUT(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(200)

        const responseData = await response.json()
        expect(responseData).toEqual(mockUpdatedProject)
        expect(mockPrisma.project.findFirst).toHaveBeenCalledWith({
            where: {
                name: mockValidProject.name,
                id: {
                    not: 1,
                },
            },
        })
        expect(mockPrisma.project.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                name: mockValidProject.name,
                description: mockValidProject.description,
            }
        })
    })

    it('returns 401 when user is not authenticated', async () => {
        // Mock unauthenticated session
        mockGetServerSession.mockResolvedValue(null)

        const request = mockRequest(mockValidProject)
        const params = Promise.resolve({ id: '1' })
        const response = await PUT(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(401)
    })

    it('returns 400 when validation fails', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock validation failure
        const validationError = {
            success: false,
            error: {
                format: () => ({
                    name: { _errors: ['Name is required'] },
                }),
            },
        }
        mockUpdateProjectSchema.safeParse.mockReturnValue(validationError)

        const request = mockRequest({ name: '', description: 'Test' })
        const params = Promise.resolve({ id: '1' })
        const response = await PUT(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(400)

        const responseData = await response.json()
        expect(responseData).toEqual(validationError.error.format())
    })

    it('returns 404 when project not found', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful validation
        mockUpdateProjectSchema.safeParse.mockReturnValue({
            success: true,
            data: mockValidProject,
        })

        // Mock project not found
        mockPrisma.project.findUnique.mockResolvedValue(null)

        const request = mockRequest(mockValidProject)
        const params = Promise.resolve({ id: '999' })
        const response = await PUT(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(404)

        const responseData = await response.json()
        expect(responseData).toEqual({ error: 'Project not found' })
    })
})

describe('DELETE /api/projects/[id]', () => {
    let DELETE: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the route handler
        const module = await import('@/app/api/projects/[id]/route')
        DELETE = module.DELETE
    })

    const mockRequest = () => {
        return {} as NextRequest
    }

    const mockProject = {
        id: 1,
        name: 'Test Project',
        description: 'Test description',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    it('can be imported successfully', () => {
        expect(DELETE).toBeDefined()
        expect(typeof DELETE).toBe('function')
    })

    it('deletes project successfully when no issues assigned', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock project exists
        mockPrisma.project.findUnique.mockResolvedValue(mockProject)

        // Mock no issues assigned
        mockPrisma.issue.count.mockResolvedValue(0)

        // Mock successful deletion
        mockPrisma.project.delete.mockResolvedValue(mockProject)

        const request = mockRequest()
        const params = Promise.resolve({ id: '1' })
        const response = await DELETE(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(200)

        const responseData = await response.json()
        expect(responseData).toEqual({ id: '1' })
        expect(mockPrisma.project.delete).toHaveBeenCalledWith({
            where: { id: 1 }
        })
    })

    it('returns 401 when user is not authenticated', async () => {
        // Mock unauthenticated session
        mockGetServerSession.mockResolvedValue(null)

        const request = mockRequest()
        const params = Promise.resolve({ id: '1' })
        const response = await DELETE(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(401)
    })

    it('returns 404 when project not found', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock project not found
        mockPrisma.project.findUnique.mockResolvedValue(null)

        const request = mockRequest()
        const params = Promise.resolve({ id: '999' })
        const response = await DELETE(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(404)

        const responseData = await response.json()
        expect(responseData).toEqual({ error: 'Project not found' })
    })

    it('returns 400 when project has assigned issues', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock project exists
        mockPrisma.project.findUnique.mockResolvedValue(mockProject)

        // Mock issues assigned
        mockPrisma.issue.count.mockResolvedValue(3)

        const request = mockRequest()
        const params = Promise.resolve({ id: '1' })
        const response = await DELETE(request, { params })

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(400)

        const responseData = await response.json()
        expect(responseData).toEqual({
            error: 'Cannot delete project "Test Project". It has 3 assigned issue(s). Please reassign all issues to another project before deleting this project.'
        })
        expect(mockPrisma.issue.count).toHaveBeenCalledWith({
            where: { projectId: 1 }
        })
    })
}) 