import EditIssuePage from '@/app/issues/edit/[id]/page'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock GraphQL queries
vi.mock('@/app/graphql/queries', () => ({
    GET_ISSUE_QUERY: { query: 'GET_ISSUE_QUERY' },
}))

// Mock GraphQL client
vi.mock('@/app/lib/graphql-client', () => ({
    client: {
        query: vi.fn(),
    },
}))

// Mock Next.js navigation
const mockNotFound = vi.fn()
vi.mock('next/navigation', () => ({
    notFound: () => mockNotFound(),
}))

// Mock dynamic import
vi.mock('next/dynamic', () => ({
    default: () => ({
        loading: () => <div data-testid="issue-form-skeleton" />,
    }),
}))

// Mock child components
vi.mock('@/app/issues/_components/IssueForm', () => ({
    default: ({ issue }: any) => (
        <div data-testid="issue-form">
            <span data-testid="issue-id">{issue.id}</span>
            <span data-testid="issue-title">{issue.title}</span>
            <span data-testid="issue-status">{issue.status}</span>
        </div>
    ),
}))

vi.mock('@/app/issues/_components/IssueFormSkeleton', () => ({
    default: () => <div data-testid="issue-form-skeleton" />,
}))

describe('Edit Issue Page', () => {
    const mockIssue = {
        id: '1',
        title: 'Test Issue to Edit',
        description: 'This is a test issue that needs editing',
        status: 'OPEN',
        assignedToUserId: 'user-123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    }

    // Get the mocked client after imports
    let mockQuery: any

    beforeEach(async () => {
        const { client } = await import('@/app/lib/graphql-client')
        mockQuery = client.query

        mockQuery.mockClear()
        mockNotFound.mockClear()
    })

    it('fetches issue with correct ID', async () => {
        mockQuery.mockResolvedValue({
            data: { issue: mockIssue },
        })

        const params = Promise.resolve({ id: '123' })
        await EditIssuePage({ params })

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '123' },
        })
    })

    it('calls notFound when issue does not exist', async () => {
        mockQuery.mockResolvedValue({
            data: { issue: null },
        })

        const params = Promise.resolve({ id: '999' })

        await EditIssuePage({ params })

        expect(mockNotFound).toHaveBeenCalled()
    })

    it('handles different issue statuses', async () => {
        const testCases = [
            { status: 'OPEN', title: 'Open Issue' },
            { status: 'IN_PROGRESS', title: 'In Progress Issue' },
            { status: 'CLOSED', title: 'Closed Issue' },
        ]

        for (const { status, title } of testCases) {
            mockQuery.mockClear()
            mockQuery.mockResolvedValue({
                data: { issue: { ...mockIssue, status, title } },
            })

            const params = Promise.resolve({ id: '1' })
            await EditIssuePage({ params })

            expect(mockQuery).toHaveBeenCalledWith({
                query: { query: 'GET_ISSUE_QUERY' },
                variables: { id: '1' },
            })
        }
    })

    it('handles issues without assignee', async () => {
        const issueWithoutAssignee = {
            ...mockIssue,
            assignedToUserId: null,
        }

        mockQuery.mockResolvedValue({
            data: { issue: issueWithoutAssignee },
        })

        const params = Promise.resolve({ id: '1' })
        await EditIssuePage({ params })

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '1' },
        })
    })

    it('renders without errors when issue has minimal data', async () => {
        const minimalIssue = {
            id: '1',
            title: 'Minimal Issue',
            description: '',
            status: 'OPEN',
            assignedToUserId: null,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
        }

        mockQuery.mockResolvedValue({
            data: { issue: minimalIssue },
        })

        const params = Promise.resolve({ id: '1' })
        await EditIssuePage({ params })

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '1' },
        })
    })

    it('handles different issue IDs', async () => {
        const testIds = ['1', '123', 'abc-123', 'issue-456']

        for (const id of testIds) {
            mockQuery.mockClear()
            mockQuery.mockResolvedValue({
                data: { issue: { ...mockIssue, id } },
            })

            const params = Promise.resolve({ id })
            await EditIssuePage({ params })

            expect(mockQuery).toHaveBeenCalledWith({
                query: { query: 'GET_ISSUE_QUERY' },
                variables: { id },
            })
        }
    })

    it('handles GraphQL errors gracefully', async () => {
        mockQuery.mockRejectedValue(new Error('Network Error'))

        const params = Promise.resolve({ id: '1' })

        await expect(EditIssuePage({ params })).rejects.toThrow('Network Error')
    })

    it('handles malformed issue data', async () => {
        const malformedIssue = {
            id: '1',
            title: null,
            description: undefined,
            status: 'UNKNOWN',
            assignedToUserId: 'invalid-user',
            createdAt: 'invalid-date',
            updatedAt: 'invalid-date',
        }

        mockQuery.mockResolvedValue({
            data: { issue: malformedIssue },
        })

        const params = Promise.resolve({ id: '1' })
        await EditIssuePage({ params })

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '1' },
        })
    })

    it('handles special characters in issue ID', async () => {
        const specialIds = ['issue-123', 'test@issue', 'issue#456', 'issue$789']

        for (const id of specialIds) {
            mockQuery.mockClear()
            mockQuery.mockResolvedValue({
                data: { issue: { ...mockIssue, id } },
            })

            const params = Promise.resolve({ id })
            await EditIssuePage({ params })

            expect(mockQuery).toHaveBeenCalledWith({
                query: { query: 'GET_ISSUE_QUERY' },
                variables: { id },
            })
        }
    })

    it('handles large issue IDs', async () => {
        const largeIds = [
            '123456789',
            'issue-999999',
            'very-long-issue-id-123456789',
        ]

        for (const id of largeIds) {
            mockQuery.mockClear()
            mockQuery.mockResolvedValue({
                data: { issue: { ...mockIssue, id } },
            })

            const params = Promise.resolve({ id })
            await EditIssuePage({ params })

            expect(mockQuery).toHaveBeenCalledWith({
                query: { query: 'GET_ISSUE_QUERY' },
                variables: { id },
            })
        }
    })

    it('handles issues with special characters in title', async () => {
        const specialTitles = [
            'Issue with special chars: !@#$%^&*()',
            'Issue with emojis 🐛🚀✨',
            'Issue with unicode: 测试问题',
            'Issue with spaces and dashes',
        ]

        for (const title of specialTitles) {
            mockQuery.mockClear()
            mockQuery.mockResolvedValue({
                data: { issue: { ...mockIssue, title } },
            })

            const params = Promise.resolve({ id: '1' })
            await EditIssuePage({ params })

            expect(mockQuery).toHaveBeenCalledWith({
                query: { query: 'GET_ISSUE_QUERY' },
                variables: { id: '1' },
            })
        }
    })

    it('handles issues with long descriptions', async () => {
        const longDescription =
            "This is a very long description that should be handled properly by the edit page component without any issues or truncation. It contains multiple sentences and should test the component's ability to handle large amounts of text data."

        mockQuery.mockResolvedValue({
            data: { issue: { ...mockIssue, description: longDescription } },
        })

        const params = Promise.resolve({ id: '1' })
        await EditIssuePage({ params })

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '1' },
        })
    })
})
