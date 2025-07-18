import prisma from '@/prisma/client'
import { notFound } from 'next/navigation'
import React from 'react'


interface Props {
    params: Promise<{
        id: string
    }>
}


const IssueDetailsPage = async ({params}: Props) => {
    const {id} = await params

    const issue = await prisma.issue.findUnique({
        where: {id: parseInt(id)}
    })

  return (
    <div>
        {issue && 
        <>
        <p>{issue.title}</p>
        <p>{issue.status}</p>
        <p>{issue.createdAt.toDateString()}</p>
        </>}       
    </div>
  )
}

export default IssueDetailsPage