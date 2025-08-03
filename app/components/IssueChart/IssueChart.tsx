'use client'

import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Card } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import { GET_ISSUES_STATUS_COUNT_QUERY } from '../../graphql/queries'
import IssueChartSkeleton from './IssueChartSkeleton'
import IssuesBarChart from './IssuesBarChart'

interface IssueStatusCount {
    label: string
    status: string
    count: number
}

const IssueChart = () => {
    const [issueStatusCount, setIssueStatusCount] = useState<
        IssueStatusCount[]
    >([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Add artificial delay to see the skeleton
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const { data } = await graphqlClient.query({
                    query: GET_ISSUES_STATUS_COUNT_QUERY,
                })

                setIssueStatusCount(data.issueStatusCount)
            } catch (error) {
                console.error('Error fetching issue status count:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <IssueChartSkeleton />
    }

    return (
        <Card className="mt-5">
            <IssuesBarChart issueData={issueStatusCount} />
        </Card>
    )
}

export default IssueChart
