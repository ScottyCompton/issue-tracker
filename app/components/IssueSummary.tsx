import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Card, Flex, Heading, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { Suspense } from 'react'
import { GET_ISSUES_STATUS_COUNT_QUERY } from '../graphql/queries'
import IssueSummarySkeleton from './IssueSummarySkeleton'

interface IssueStatusCount {
    label: string
    status: string
    count: number
}

export const IssueSummaryContent = async () => {
    // Add artificial delay to see the skeleton
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { data } = await graphqlClient.query({
        query: GET_ISSUES_STATUS_COUNT_QUERY,
        variables: {
            includeAll: true,
        },
        fetchPolicy: 'network-only', // Always fetch fresh data
    })

    const { issueStatusCount } = data

    return (
        <Flex direction="column" className="w-full">
            <Heading size="4" mb="5">
                Issue Status Summary
            </Heading>
            <Flex gap="3" className="w-full">
                {issueStatusCount.map((item: IssueStatusCount) => (
                    <Card
                        key={Math.floor(Math.random() * 1000)}
                        className="flex-1 w-full"
                    >
                        <Flex direction="column" gap="2">
                            <Link
                                className="text-[10px] sm:text-xs font-medium whitespace-nowrap pr-3 hover:text-violet-600 transition-colors"
                                href={`/issues/list/${item.status !== '' ? '?status=' + item.status : ''}`}
                            >
                                {item.label}{' '}
                                <span className="hidden sm:inline">Issues</span>
                            </Link>
                            <Text size="6" className="font-bold">
                                {item.count}
                            </Text>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </Flex>
    )
}

const IssueSummary = () => {
    return (
        <Suspense fallback={<IssueSummarySkeleton />}>
            <IssueSummaryContent />
        </Suspense>
    )
}

export default IssueSummary
