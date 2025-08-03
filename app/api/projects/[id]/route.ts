import authOptions from "@/app/auth/authOptions";
import { updateProjectSchema } from "@/app/schemas/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({}, { status: 401 })
    }

    const { id } = await params

    const project = await prisma.project.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
}

export async function PUT(request: NextRequest, { params }: Props) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({}, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validation = updateProjectSchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }

    // Verify the project exists
    const existingProject = await prisma.project.findUnique({
        where: { id: parseInt(id) }
    })

    if (!existingProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check for duplicate project name if name is being updated
    if (body.name !== undefined) {
        const duplicateProject = await prisma.project.findFirst({
            where: {
                name: body.name.trim(),
                id: {
                    not: parseInt(id), // Exclude current project from check
                },
            },
        })

        if (duplicateProject) {
            return NextResponse.json(
                { error: `A project with the name "${body.name.trim()}" already exists` },
                { status: 400 }
            )
        }
    }

    // Update the project
    const updatedProject = await prisma.project.update({
        where: { id: parseInt(id) },
        data: {
            name: body.name?.trim() || existingProject.name,
            description: body.description?.trim() || existingProject.description,
        }
    })

    return NextResponse.json(updatedProject)
}

export async function DELETE(request: NextRequest, { params }: Props) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({}, { status: 401 })
    }

    const { id } = await params

    // Check if project exists
    const project = await prisma.project.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if project has assigned issues
    const issuesCount = await prisma.issue.count({
        where: {
            projectId: parseInt(id)
        }
    })

    if (issuesCount > 0) {
        return NextResponse.json(
            { 
                error: `Cannot delete project "${project.name}". It has ${issuesCount} assigned issue(s). Please reassign all issues to another project before deleting this project.` 
            },
            { status: 400 }
        )
    }

    // Delete the project
    await prisma.project.delete({
        where: {
            id: parseInt(id)
        }
    })

    return NextResponse.json({ id: id }, { status: 200 })
} 