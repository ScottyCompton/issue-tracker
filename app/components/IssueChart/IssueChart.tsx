import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Card } from '@radix-ui/themes'
import { Suspense } from 'react'
import { GET_ISSUES_STATUS_COUNT_QUERY } from '../../graphql/queries'
import IssueChartSkeleton from './IssueChartSkeleton'
import IssuesBarChart from './IssuesBarChart'

interface IssueStatusCount {
    label: string
    status: string
    count: number
}

export const IssueChartContent = async () => {
    // Add artificial delay to see the skeleton
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { data } = await graphqlClient.query({
        query: GET_ISSUES_STATUS_COUNT_QUERY,
    })

    const { issueStatusCount } = data

    return (
        <Card className="mt-5">
            <IssuesBarChart issueData={issueStatusCount} />
        </Card>
    )
}

const IssueChart = () => {
    return (
        <Suspense fallback={<IssueChartSkeleton />}>
            <IssueChartContent />
        </Suspense>
    )
}

export default IssueChart
