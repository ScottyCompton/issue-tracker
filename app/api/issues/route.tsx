import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { issueSchema } from '../../schemas/validationSchemas'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/auth/authOptions'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({}, { status: 401 })
    }
    const body = await request.json()
    const validation = issueSchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }

    // Default project assignment logic
    let projectId = null
    if (body.projectId) {
        // Validate that the specified project exists
        const project = await prisma.project.findUnique({
            where: { id: parseInt(body.projectId) },
        })
        if (!project) {
            return NextResponse.json({ error: 'Invalid projectId' }, { status: 400 })
        }
        projectId = parseInt(body.projectId)
    } else {
        // Assign to default project (first project) if no project specified
        const defaultProject = await prisma.project.findFirst({
            orderBy: { id: 'asc' },
        })
        if (defaultProject) {
            projectId = defaultProject.id
        }
        // If no projects exist, projectId remains null (unassigned)
    }

    const newIssue = await prisma.issue.create({
        data: {
            title: body.title,
            description: body.description,
            projectId: projectId,
        },
    })

    return NextResponse.json(newIssue, { status: 201 })
}
