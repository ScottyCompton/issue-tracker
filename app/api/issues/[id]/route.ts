import { issueSchema } from "@/app/schemas/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: Promise<
        {id: string}
    >
}


export async function PATCH(request: NextRequest, {params}: Props)  {
    const {id} = await params
    const body = await request.json()
    const validation = issueSchema.safeParse(body)

    // validate the inputs
    if(!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400})
    }

    // verify the issue indicated actually exists
    const issue = await prisma.issue.findUnique(
       { where: {id: parseInt(id)}}
    )

    // if non-existent issue, return 404 error
    if(!issue) {
        return NextResponse.json({error: 'Invalid Issue'}, {status: 404})
    }

    // update the issue
    const updatedIssue = await prisma.issue.update({
        where: {id: parseInt(id)},
        data: {
            title: body.title,
            description: body.description
        }
    })

    // return the updated result
    return NextResponse.json(updatedIssue)
}