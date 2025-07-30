import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Status } from '@/prisma/client'
import { Avatar, Card, Flex, Heading, Table } from '@radix-ui/themes'
import Link from 'next/link'
import { GET_LATEST_ISSUES_QUERY } from '../graphql/queries'
import IssueStatusBadge from './IssueStatusBadge'

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

const LatestIssues: React.FC = async () => {
    const { data } = await graphqlClient.query<LatestIssues>({
        query: GET_LATEST_ISSUES_QUERY,
        fetchPolicy: 'network-only', // Always fetch fresh data
    })

    const { latestIssues } = data

    return (
        <Card>
            <Heading size="4" mb="5">
                Latest Issues
            </Heading>
            <Table.Root>
                <Table.Body>
                    {latestIssues &&
                        latestIssues.map((issue: LatestIssue) => (
                            <Table.Row key={issue.id}>
                                <Table.Cell>
                                    <Flex justify="between">
                                        <Flex
                                            direction="column"
                                            align="start"
                                            gap="2"
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
                                            <Avatar
                                                src={
                                                    issue.assignedToUser.image!
                                                }
                                                fallback="?"
                                                size="2"
                                                radius="full"
                                            />
                                        )}
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table.Root>
        </Card>
    )
}

export default LatestIssues
