import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Status } from '@/prisma/client'
import { Avatar, Card, Flex, Heading, Tooltip } from '@radix-ui/themes'
import Link from 'next/link'
import { Suspense } from 'react'
import { GET_LATEST_ISSUES_QUERY } from '../graphql/queries'
import IssueStatusBadge from './IssueStatusBadge'
import LatestIssuesSkeleton from './LatestIssuesSkeleton'

interface AssignedToUser {
    id: string
    name: string
    email: string
    image: string
}

interface LatestIssue {
    id: string
    title: string
    status: Status
    assignedToUser: AssignedToUser
}

interface LatestIssues {
    latestIssues: LatestIssue[]
}

export const LatestIssuesContent = async () => {
    // Add artificial delay to see the skeleton
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { data } = await graphqlClient.query<LatestIssues>({
        query: GET_LATEST_ISSUES_QUERY,
        fetchPolicy: 'network-only', // Always fetch fresh data
    })

    const { latestIssues } = data

    return (
        <Flex direction="column" className="w-full">
            <Heading size="4" mb="5">
                Latest Issues
            </Heading>
            <Card>
                <Flex direction="column" className="w-full">
                    {latestIssues &&
                        latestIssues.map(
                            (issue: LatestIssue, index: number) => (
                                <Flex
                                    key={issue.id}
                                    justify="between"
                                    align="center"
                                    className={`p-4 ${
                                        index !== latestIssues.length - 1
                                            ? 'border-b border-gray-200'
                                            : ''
                                    }`}
                                >
                                    <Flex
                                        direction="column"
                                        align="start"
                                        gap="2"
                                        className="flex-1"
                                    >
                                        <Link
                                            href={`/issues/${issue.id}`}
                                            className="hover:text-violet-600 transition-colors"
                                        >
                                            {issue.title}
                                        </Link>
                                        <IssueStatusBadge
                                            status={issue.status}
                                        />
                                    </Flex>
                                    {issue.assignedToUser && (
                                        <Tooltip
                                            content={issue.assignedToUser.name}
                                        >
                                            <Avatar
                                                src={
                                                    issue.assignedToUser.image!
                                                }
                                                fallback="?"
                                                size="2"
                                                radius="full"
                                            />
                                        </Tooltip>
                                    )}
                                </Flex>
                            )
                        )}
                </Flex>
            </Card>
        </Flex>
    )
}

const LatestIssues = () => {
    return (
        <Suspense fallback={<LatestIssuesSkeleton />}>
            <LatestIssuesContent />
        </Suspense>
    )
}

export default LatestIssues
