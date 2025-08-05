'use client'

import Pagination from '@/app/components/Pagination'
import { useProject } from '@/app/contexts/ProjectContext'
import { GET_ISSUES_COUNT_QUERY, GET_ISSUES_QUERY } from '@/app/graphql/queries'
import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Box } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import IssuesList, { IssueQuery } from '../_components/IssuesList'

interface Props {
    searchParams: Promise<IssueQuery>
    initialIssues: any[]
    initialIssuesCount: number
    currentUser: any
    currentPage: number
    currentPageSize: number
}

const IssuesListWrapper: React.FC<Props> = ({
    searchParams,
    initialIssues,
    initialIssuesCount,
    currentUser,
    currentPage,
    currentPageSize,
}: Props) => {
    const { selectedProjectId } = useProject()
    const [issues, setIssues] = useState(initialIssues)
    const [issuesCount, setIssuesCount] = useState(initialIssuesCount)
    const [loading, setLoading] = useState(false)
    const [resolvedSearchParams, setResolvedSearchParams] =
        useState<IssueQuery | null>(null)

    // Resolve searchParams once on mount
    useEffect(() => {
        const resolveSearchParams = async () => {
            const params = await searchParams
            setResolvedSearchParams(params)
        }
        resolveSearchParams()
    }, [searchParams])

    useEffect(() => {
        const fetchFilteredData = async () => {
            if (!selectedProjectId || !resolvedSearchParams) {
                // If no project selected, use initial data
                setIssues(initialIssues)
                setIssuesCount(initialIssuesCount)
                return
            }

            setLoading(true)
            try {
                const { status, issueType, sortBy, sortOrder, userId } =
                    resolvedSearchParams

                const queryVariables = {
                    status,
                    issueType,
                    assignedToUserId: userId,
                    projectId: selectedProjectId,
                    orderBy:
                        sortBy && sortOrder
                            ? { [sortBy]: sortOrder }
                            : undefined,
                    paging: {
                        skip: (currentPage - 1) * currentPageSize,
                        take: currentPageSize,
                    },
                }

                const { data } = await graphqlClient.query({
                    query: GET_ISSUES_QUERY,
                    variables: queryVariables,
                    fetchPolicy: 'network-only',
                })
                setIssues(data?.issues ?? [])

                const { data: issuesCountData } = await graphqlClient.query({
                    query: GET_ISSUES_COUNT_QUERY,
                    variables: {
                        status,
                        issueType,
                        assignedToUserId: userId,
                        projectId: selectedProjectId,
                    },
                    fetchPolicy: 'network-only',
                })
                setIssuesCount(issuesCountData?.issuesCount ?? 0)
            } catch (error) {
                console.error('Error fetching filtered issues:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFilteredData()
    }, [
        selectedProjectId,
        resolvedSearchParams,
        currentPage,
        currentPageSize,
        initialIssues,
        initialIssuesCount,
    ])

    if (loading || !resolvedSearchParams) {
        return <div>Loading...</div>
    }

    return (
        <>
            <IssuesList
                searchParams={resolvedSearchParams}
                issues={issues}
                currentUser={currentUser}
            />
            <Box className="text-center w-full">
                <Pagination
                    pageSize={currentPageSize}
                    itemCount={issuesCount}
                    currentPage={currentPage}
                />
            </Box>
        </>
    )
}

export default IssuesListWrapper
