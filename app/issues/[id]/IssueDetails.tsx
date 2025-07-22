import { IssueStatusBadge } from '@/app/components'
import { Card, Flex, Heading, Text } from '@radix-ui/themes'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { formatDate } from '@/app/lib/utils'
import { Status } from '@/app/generated/prisma'

interface GraphQLIssue {
    id: string
    title: string
    description: string | null
    status: Status
    createdAt: string
    updatedAt: string
    assignedToUserId: string | null
}

interface Props {
    issue: GraphQLIssue
}

const IssueDetails:React.FC<Props> = ({issue}: Props) => {
  return (
    <>
    <Heading>{issue.title}</Heading>
        <Flex className='space-x-3' my="2">
            <IssueStatusBadge status={issue.status} />
            <Text>{formatDate(issue.createdAt)}</Text>
        </Flex>
        <Card mt="4">
            <span className='prose'>
                <ReactMarkdown>{issue.description}</ReactMarkdown>
            </span>
        </Card>
    </>
  )
}

export default IssueDetails