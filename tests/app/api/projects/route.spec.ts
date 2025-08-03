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
        findMany: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
    },
}
vi.mock('@/prisma/client', () => ({
    default: mockPrisma,
}))

// Mock validation schemas
const mockCreateProjectSchema = {
    safeParse: vi.fn(),
}
vi.mock('@/app/schemas/validationSchemas', () => ({
    createProjectSchema: mockCreateProjectSchema,
}))

// Mock auth options
vi.mock('@/app/auth/authOptions', () => ({
    default: {},
}))

describe('GET /api/projects', () => {
    let GET: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the route handler
        const module = await import('@/app/api/projects/route')
        GET = module.GET
    })

    const mockRequest = () => {
        return {} as NextRequest
    }

    const mockProjects = [
        {
            id: 1,
            name: 'Project Alpha',
            description: 'First project',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 2,
            name: 'Project Beta',
            description: 'Second project',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ]

    it('can be imported successfully', () => {
        expect(GET).toBeDefined()
        expect(typeof GET).toBe('function')
    })

    it('returns all projects successfully', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful database query
        mockPrisma.project.findMany.mockResolvedValue(mockProjects)

        const request = mockRequest()
        const response = await GET(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(200)

        const responseData = await response.json()
        expect(responseData).toEqual(mockProjects)
        expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
            orderBy: {
                name: 'asc'
            }
        })
    })

    it('returns 401 when user is not authenticated', async () => {
        // Mock unauthenticated session
        mockGetServerSession.mockResolvedValue(null)

        const request = mockRequest()
        const response = await GET(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(401)
    })
})

describe('POST /api/projects', () => {
    let POST: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the route handler
        const module = await import('@/app/api/projects/route')
        POST = module.POST
    })

    const mockRequest = (body: any) => {
        return {
            json: vi.fn().mockResolvedValue(body),
        } as unknown as NextRequest
    }

    const mockValidProject = {
        name: 'Test Project',
        description: 'Test description',
    }

    const mockCreatedProject = {
        id: 1,
        name: 'Test Project',
        description: 'Test description',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    it('can be imported successfully', () => {
        expect(POST).toBeDefined()
        expect(typeof POST).toBe('function')
    })

    it('creates a new project successfully', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        // Mock successful validation
        mockCreateProjectSchema.safeParse.mockReturnValue({
            success: true,
            data: mockValidProject,
        })

        // Mock no duplicate project found
        mockPrisma.project.findFirst.mockResolvedValue(null)

        // Mock successful database creation
        mockPrisma.project.create.mockResolvedValue(mockCreatedProject)

        const request = mockRequest(mockValidProject)
        const response = await POST(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(201)

        const responseData = await response.json()
        expect(responseData).toEqual(mockCreatedProject)
        expect(mockPrisma.project.findFirst).toHaveBeenCalledWith({
            where: {
                name: mockValidProject.name,
            },
        })
        expect(mockPrisma.project.create).toHaveBeenCalledWith({
            data: {
                name: mockValidProject.name,
                description: mockValidProject.description,
            },
        })
    })

    it('returns 401 when user is not authenticated', async () => {
        // Mock unauthenticated session
        mockGetServerSession.mockResolvedValue(null)

        const request = mockRequest(mockValidProject)
        const response = await POST(request)

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
        mockCreateProjectSchema.safeParse.mockReturnValue(validationError)

        const request = mockRequest({ name: '', description: 'Test' })
        const response = await POST(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(400)

        const responseData = await response.json()
        expect(responseData).toEqual(validationError.error.format())
    })

    it('creates project without description', async () => {
        // Mock successful authentication
        mockGetServerSession.mockResolvedValue({ user: { id: '1' } })

        const projectWithoutDescription = {
            name: 'Test Project',
        }

        // Mock successful validation
        mockCreateProjectSchema.safeParse.mockReturnValue({
            success: true,
            data: projectWithoutDescription,
        })

        // Mock no duplicate project found
        mockPrisma.project.findFirst.mockResolvedValue(null)

        // Mock successful database creation
        mockPrisma.project.create.mockResolvedValue({
            ...mockCreatedProject,
            description: null,
        })

        const request = mockRequest(projectWithoutDescription)
        const response = await POST(request)

        expect(response).toBeInstanceOf(NextResponse)
        expect(response.status).toBe(201)

        expect(mockPrisma.project.findFirst).toHaveBeenCalledWith({
            where: {
                name: projectWithoutDescription.name,
            },
        })
        expect(mockPrisma.project.create).toHaveBeenCalledWith({
            data: {
                name: projectWithoutDescription.name,
                description: null,
            },
        })
    })
}) 