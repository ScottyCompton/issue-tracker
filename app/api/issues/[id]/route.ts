import authOptions from "@/app/auth/authOptions";
import { updateIssueSchema } from "@/app/schemas/validationSchemas";
import prisma from "@/prisma/client";
import delay from "delay";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: Promise<
        {id: string}
    >
}

export async function DELETE(request: NextRequest, {params}: Props) {
    const session = await getServerSession(authOptions)

    if(!session) {
        return NextResponse.json({}, {status: 401})
    }

    const {id} = await params

    const issue = await prisma.issue.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if(!issue) {
        return NextResponse.json({error: 'Invalid Issue'}, {status: 400})
    }

    const deletedIssue = await prisma.issue.delete({
        where: {
            id: parseInt(id)
        }
    })

    return NextResponse.json({id: id}, {status: 201})
}


export async function PATCH(request: NextRequest, {params}: Props)  {
    const session = await getServerSession(authOptions)

    if(!session) {
        return NextResponse.json({}, {status: 401})
    }
    const {id} = await params
    const body = await request.json()
    const validation = updateIssueSchema.safeParse(body)

    // validate the inputs
    if(!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400})
    }

    const {assignedToUserId, title, description, projectId} = body

    if(assignedToUserId) {
        const user = prisma.user.findUnique({
            where: {
                id: assignedToUserId
            }
        })
        if(!user) {
            return NextResponse.json({error: 'Invalid User'}, {status: 400})
        }
    }

    // verify the issue indicated actually exists
    const issue = await prisma.issue.findUnique(
       { where: {id: parseInt(id)}}
    )

    // if non-existent issue, return 404 error
    if(!issue) {
        return NextResponse.json({error: 'Invalid Issue'}, {status: 404})
    }

    // Enhanced project validation
    let validatedProjectId = null
    if (projectId !== undefined) {
        if (projectId === null) {
            // Allow unassigning from project (setting to null)
            validatedProjectId = null
        } else {
            // Validate that the specified project exists
            const project = await prisma.project.findUnique({
                where: { id: parseInt(projectId) },
            })
            if (!project) {
                return NextResponse.json({error: 'Invalid projectId'}, {status: 400})
            }
            validatedProjectId = parseInt(projectId)
        }
    } else {
        // Keep existing projectId if not provided in update
        validatedProjectId = issue.projectId
    }

    // update the issue
    const updatedIssue = await prisma.issue.update({
        where: {id: parseInt(id)},
        data: {
            title, 
            description, 
            assignedToUserId,
            projectId: validatedProjectId,
        }
    })

    // return the updated result
    return NextResponse.json(updatedIssue)
}