import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import prisma from '@/prisma/client'
import { Card, Flex, Heading } from '@radix-ui/themes'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

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

    if(!issue) notFound()
  return (
    <div>
        <Heading>{issue.title}</Heading>
        <Flex className='space-x-3' my="2">
            <p><IssueStatusBadge status={issue.status} /></p>
            <p>{issue.createdAt.toDateString()}</p>
        </Flex>
        <Card mt="4">
            <span className='prose'>
                <ReactMarkdown>{issue.description}</ReactMarkdown>
            </span>
        </Card>
    </div>
  )
}

export default IssueDetailsPage