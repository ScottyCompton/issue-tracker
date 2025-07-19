import { IssueStatusBadge } from '@/app/components'
import { Issue } from '@/app/generated/prisma'
import { Card, Flex, Heading, Text } from '@radix-ui/themes'
import React from 'react'
import ReactMarkdown from 'react-markdown'

interface Props {
    issue: Issue
}

const IssueDetails:React.FC<Props> = ({issue}: Props) => {
  return (
    <>
    <Heading>{issue.title}</Heading>
        <Flex className='space-x-3' my="2">
            <IssueStatusBadge status={issue.status} />
            <Text>{issue.createdAt.toDateString()}</Text>
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