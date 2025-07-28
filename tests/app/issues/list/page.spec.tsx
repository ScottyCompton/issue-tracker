import IssuesPage from '@/app/issues/list/page'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock GraphQL queries
vi.mock('@/app/graphql/queries', () => ({
    GET_ISSUES_QUERY: { query: 'GET_ISSUES_QUERY' },
    GET_ISSUES_COUNT_QUERY: { query: 'GET_ISSUES_COUNT_QUERY' },
}))

// Mock GraphQL client
vi.mock('@/app/lib/graphql-client', () => ({
    client: {
        query: vi.fn(),
    },
}))

// Mock child components
vi.mock('@/app/issues/_components/IssuesList', () => ({
    default: ({ issues }: any) => (
        <div data-testid="issues-list">
            {issues?.map((issue: any) => (
                <div key={issue.id} data-testid={`issue-${issue.id}`}>
                    {issue.title}
                </div>
            ))}
        </div>
    ),
}))

vi.mock('@/app/issues/_components/IssuesToolbar', () => ({
    default: ({ currStatus }: any) => (
        <div data-testid="issues-toolbar">
            <span data-testid="current-status">{currStatus}</span>
        </div>
    ),
}))

vi.mock('@/app/components/Pagination', () => ({
    default: ({ currentPage, itemCount, pageSize }: any) => (
        <div data-testid="pagination">
            <span data-testid="current-page">{currentPage}</span>
            <span data-testid="item-count">{itemCount}</span>
            <span data-testid="page-size">{pageSize}</span>
        </div>
    ),
}))

describe('Issues List Page', () => {
    const mockIssues = [
        { id: '1', title: 'Issue 1', status: 'OPEN' },
        { id: '2', title: 'Issue 2', status: 'IN_PROGRESS' },
        { id: '3', title: 'Issue 3', status: 'CLOSED' },
    ]

    const mockIssuesCount = 25

    // Get the mocked client after imports
    let mockQuery: any

    beforeEach(async () => {
        const { client } = await import('@/app/lib/graphql-client')
        mockQuery = client.query

        mockQuery.mockClear()
        // Mock the first call (GET_ISSUES_QUERY)
        mockQuery.mockResolvedValueOnce({
            data: { issues: mockIssues },
        })
        // Mock the second call (GET_ISSUES_COUNT_QUERY)
        mockQuery.mockResolvedValueOnce({
            data: { issuesCount: mockIssuesCount },
        })
    })

    it('fetches issues with correct query parameters', async () => {
        const searchParams = Promise.resolve({
            status: 'OPEN',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: '2',
        })

        await IssuesPage({ searchParams })

        expect(mockQuery).toHaveBeenCalledTimes(2)

        // Check first call for issues
        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            query: { query: 'GET_ISSUES_QUERY' },
            variables: {
                status: 'OPEN',
                orderBy: { createdAt: 'desc' },
                paging: {
                    skip: 10, // (2 - 1) * 10
                    take: 10,
                },
            },
        })

        // Check second call for count
        expect(mockQuery).toHaveBeenNthCalledWith(2, {
            query: { query: 'GET_ISSUES_COUNT_QUERY' },
            variables: { status: 'OPEN' },
        })
    })

    it('handles default pagination parameters', async () => {
        const searchParams = Promise.resolve({
            status: '',
            sortBy: undefined,
            sortOrder: undefined,
            page: undefined,
        })

        await IssuesPage({ searchParams })

        // Check first call for issues
        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            query: { query: 'GET_ISSUES_QUERY' },
            variables: {
                status: '',
                orderBy: undefined,
                paging: {
                    skip: 0, // (1 - 1) * 10
                    take: 10,
                },
            },
        })
    })

    it('handles different page numbers correctly', async () => {
        const testCases = [
            { page: '1', expectedSkip: 0 },
            { page: '2', expectedSkip: 10 },
            { page: '3', expectedSkip: 20 },
            { page: '5', expectedSkip: 40 },
        ]

        for (const { page, expectedSkip } of testCases) {
            mockQuery.mockClear()
            mockQuery
                .mockResolvedValueOnce({
                    data: { issues: mockIssues },
                })
                .mockResolvedValueOnce({
                    data: { issuesCount: mockIssuesCount },
                })

            const searchParams = Promise.resolve({
                status: 'OPEN',
                sortBy: 'createdAt',
                sortOrder: 'desc',
                page,
            })

            await IssuesPage({ searchParams })

            expect(mockQuery).toHaveBeenNthCalledWith(1, {
                query: { query: 'GET_ISSUES_QUERY' },
                variables: expect.objectContaining({
                    paging: {
                        skip: expectedSkip,
                        take: 10,
                    },
                }),
            })
        }
    })

    it('handles different sorting parameters', async () => {
        const testCases = [
            { sortBy: 'createdAt', sortOrder: 'desc' },
            { sortBy: 'title', sortOrder: 'asc' },
            { sortBy: 'status', sortOrder: 'desc' },
        ]

        for (const { sortBy, sortOrder } of testCases) {
            mockQuery.mockClear()
            mockQuery
                .mockResolvedValueOnce({
                    data: { issues: mockIssues },
                })
                .mockResolvedValueOnce({
                    data: { issuesCount: mockIssuesCount },
                })

            const searchParams = Promise.resolve({
                status: 'OPEN',
                sortBy,
                sortOrder,
                page: '1',
            })

            await IssuesPage({ searchParams })

            expect(mockQuery).toHaveBeenNthCalledWith(1, {
                query: { query: 'GET_ISSUES_QUERY' },
                variables: expect.objectContaining({
                    orderBy: { [sortBy]: sortOrder },
                }),
            })
        }
    })

    it('handles undefined sorting parameters', async () => {
        const searchParams = Promise.resolve({
            status: 'OPEN',
            sortBy: undefined,
            sortOrder: undefined,
            page: '1',
        })

        await IssuesPage({ searchParams })

        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            query: { query: 'GET_ISSUES_QUERY' },
            variables: expect.objectContaining({
                orderBy: undefined,
            }),
        })
    })

    it('processes search parameters correctly', async () => {
        const searchParams = Promise.resolve({
            status: 'IN_PROGRESS',
            sortBy: 'title',
            sortOrder: 'asc',
            page: '3',
        })

        await IssuesPage({ searchParams })

        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            query: { query: 'GET_ISSUES_QUERY' },
            variables: {
                status: 'IN_PROGRESS',
                orderBy: { title: 'asc' },
                paging: {
                    skip: 20, // (3 - 1) * 10
                    take: 10,
                },
            },
        })
    })

    it('handles string page numbers', async () => {
        const searchParams = Promise.resolve({
            status: 'OPEN',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: '10',
        })

        await IssuesPage({ searchParams })

        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            query: { query: 'GET_ISSUES_QUERY' },
            variables: expect.objectContaining({
                paging: {
                    skip: 90, // (10 - 1) * 10
                    take: 10,
                },
            }),
        })
    })

    it('handles empty search parameters', async () => {
        // Clear previous mocks and set up for this test
        mockQuery.mockClear()
        mockQuery
            .mockResolvedValueOnce({
                data: { issues: mockIssues },
            })
            .mockResolvedValueOnce({
                data: { issuesCount: mockIssuesCount },
            })

        const searchParams = Promise.resolve({
            status: '',
            sortBy: '',
            sortOrder: '',
            page: '',
        })

        await IssuesPage({ searchParams })

        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            query: { query: 'GET_ISSUES_QUERY' },
            variables: {
                status: '',
                orderBy: undefined,
                paging: {
                    skip: 0,
                    take: 10,
                },
            },
        })
    })
})
