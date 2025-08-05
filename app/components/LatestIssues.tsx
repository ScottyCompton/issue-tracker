'use client'

import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Status } from '@/prisma/client'
import { Avatar, Card, Flex, Heading, Text, Tooltip } from '@radix-ui/themes'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useProject } from '../contexts/ProjectContext'
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
    issueType: string
    projectId?: string
    project?: {
        id: string
        name: string
    }
    user?: AssignedToUser | null
}

interface LatestIssues {
    latestIssues: LatestIssue[]
}

const LatestIssues = () => {
    const { selectedProjectId } = useProject()
    const [latestIssues, setLatestIssues] = useState<LatestIssue[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Add artificial delay to see the skeleton
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const { data } = await graphqlClient.query<LatestIssues>({
                    query: GET_LATEST_ISSUES_QUERY,
                    variables: {
                        projectId: selectedProjectId,
                    },
                    fetchPolicy: 'network-only', // Always fetch fresh data
                })

                setLatestIssues(data?.latestIssues ?? [])
            } catch (error) {
                console.error('Error fetching latest issues:', error)
                setLatestIssues([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [selectedProjectId])

    if (loading) {
        return <LatestIssuesSkeleton />
    }

    return (
        <Flex direction="column" className="w-full">
            <Heading size="4" mb="5">
                Latest Issues
            </Heading>
            <Card>
                <Flex direction="column" className="w-full">
                    {latestIssues && latestIssues.length > 0 ? (
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
                                    {issue.user && (
                                        <Tooltip content={issue.user.name}>
                                            <Avatar
                                                src={issue.user.image!}
                                                fallback="?"
                                                size="2"
                                                radius="full"
                                            />
                                        </Tooltip>
                                    )}
                                </Flex>
                            )
                        )
                    ) : (
                        <Flex justify="center" align="center" className="p-8">
                            <Text color="gray">
                                {selectedProjectId
                                    ? 'No issues found for the selected project.'
                                    : 'No issues found.'}
                            </Text>
                        </Flex>
                    )}
                </Flex>
            </Card>
        </Flex>
    )
}

export default LatestIssues
