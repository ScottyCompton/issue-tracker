import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { createProjectSchema } from '../../schemas/validationSchemas'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/auth/authOptions'

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({}, { status: 401 })
    }

    const projects = await prisma.project.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({}, { status: 401 })
    }

    const body = await request.json()
    const validation = createProjectSchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }

    // Check for duplicate project name
    const existingProject = await prisma.project.findFirst({
        where: {
            name: body.name.trim(),
        },
    })

    if (existingProject) {
        return NextResponse.json(
            { error: `A project with the name "${body.name.trim()}" already exists` },
            { status: 400 }
        )
    }

    const newProject = await prisma.project.create({
        data: {
            name: body.name.trim(),
            description: body.description?.trim() || null,
        },
    })

    return NextResponse.json(newProject, { status: 201 })
} 