import {
    GET_ISSUES_COUNT_QUERY,
    GET_ISSUES_QUERY,
    GET_USERS_QUERY,
} from '@/app/graphql/queries'
import { client as graphqlClient } from '@/app/lib/graphql-client'
import { IssueQuery } from '../_components/IssuesList'
import IssuesToolbar from '../_components/IssuesToolbar'
import IssuesListWrapper from './IssuesListWrapper'

interface Props {
    searchParams: Promise<IssueQuery>
}

const IssuesPage: React.FC<Props> = async ({ searchParams }: Props) => {
    const { status, issueType, sortBy, sortOrder, page, pageSize, userId } =
        await searchParams
    const currentPage = page ? parseInt(page) : 1
    const currentPageSize = pageSize ? parseInt(pageSize) : 10

    const queryVariables = {
        status,
        issueType,
        assignedToUserId: userId,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : undefined,
        paging: {
            skip: (currentPage - 1) * currentPageSize,
            take: currentPageSize,
        },
    }

    const { data } = await graphqlClient.query({
        query: GET_ISSUES_QUERY,
        variables: queryVariables,
        fetchPolicy: 'network-only', // Always fetch fresh data
    })
    const issues = data?.issues ?? []

    const { data: issuesCountData } = await graphqlClient.query({
        query: GET_ISSUES_COUNT_QUERY,
        variables: { status, issueType, assignedToUserId: userId },
        fetchPolicy: 'network-only', // Always fetch fresh data
    })
    const issuesCount = issuesCountData?.issuesCount ?? 0

    // Fetch current user information if filtering by user
    let currentUser = null
    if (userId) {
        try {
            const { data: usersData } = await graphqlClient.query({
                query: GET_USERS_QUERY,
                fetchPolicy: 'network-only',
            })
            currentUser =
                usersData?.users?.find((user: any) => user.id === userId) ??
                null
        } catch (error) {
            console.error('Error fetching user information:', error)
        }
    }

    return (
        <div>
            <IssuesToolbar
                currStatus={status}
                currIssueType={issueType}
                currUserId={userId}
            />
            <IssuesListWrapper
                searchParams={searchParams}
                initialIssues={issues}
                initialIssuesCount={issuesCount}
                currentUser={currentUser}
                currentPage={currentPage}
                currentPageSize={currentPageSize}
            />
        </div>
    )
}

export const metadata = {
    title: 'Issue Tracker - Issues List',
    description: 'View all project issues',
}

export const dynamic = 'force-dynamic'
export default IssuesPage
