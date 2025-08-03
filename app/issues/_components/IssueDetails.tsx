'use client'

import { IssueStatusBadge } from '@/app/components'
import ProjectBadge from '@/app/components/ProjectBadge'
import { Status } from '@/app/generated/prisma'
import { formatDate } from '@/app/lib/utils'
import { Card, Flex, Heading, Text } from '@radix-ui/themes'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import StatusSelect from './StatusSelect'

interface GraphQLIssue {
    id: string
    title: string
    description: string | null
    status: Status
    createdAt: string
    updatedAt: string
    assignedToUserId: string | null
    projectId: string | null
    project: {
        id: string
        name: string
        description: string | null
    } | null
}

interface Props {
    issue: GraphQLIssue
}

const IssueDetails: React.FC<Props> = ({ issue }: Props) => {
    const [currentStatus, setCurrentStatus] = useState<Status>(issue.status)

    const handleStatusChange = (newStatus: Status) => {
        setCurrentStatus(newStatus)
    }

    return (
        <>
            <Flex justify="between" align="center" mb="2">
                <Heading>{issue.title}</Heading>
                <StatusSelect
                    issueId={issue.id}
                    currentStatus={currentStatus}
                    onStatusChange={handleStatusChange}
                />
            </Flex>
            <Flex className="space-x-3" my="2">
                <IssueStatusBadge status={currentStatus} />
                <ProjectBadge project={issue.project} />
                <Text>{formatDate(issue.createdAt)}</Text>
            </Flex>
            <Card mt="4">
                <span className="prose">
                    <ReactMarkdown>{issue.description}</ReactMarkdown>
                </span>
            </Card>
        </>
    )
}

export default IssueDetails
