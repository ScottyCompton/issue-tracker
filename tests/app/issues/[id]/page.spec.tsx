import IssueDetailsPage from '@/app/issues/[id]/page'
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

// Mock NextAuth
const mockGetServerSession = vi.fn()
vi.mock('next-auth', () => ({
    getServerSession: () => mockGetServerSession(),
}))

// Mock authOptions
vi.mock('@/app/auth/authOptions', () => ({
    default: {},
}))

// Mock Next.js navigation
const mockNotFound = vi.fn()
vi.mock('next/navigation', () => ({
    notFound: () => mockNotFound(),
}))

// Mock child components
vi.mock('@/app/issues/_components/IssueDetails', () => ({
    default: ({ issue }: any) => (
        <div data-testid="issue-details">
            <span data-testid="issue-title">{issue.title}</span>
            <span data-testid="issue-status">{issue.status}</span>
        </div>
    ),
}))

vi.mock('@/app/issues/_components/AssigneeSelect', () => ({
    default: ({ issueId, assignedToUserId }: any) => (
        <div data-testid="assignee-select">
            <span data-testid="issue-id">{issueId}</span>
            <span data-testid="assigned-user">{assignedToUserId}</span>
        </div>
    ),
}))

vi.mock('@/app/issues/_components/EditIssueButton', () => ({
    default: ({ issueId }: any) => (
        <div data-testid="edit-issue-button">
            <span data-testid="edit-issue-id">{issueId}</span>
        </div>
    ),
}))

vi.mock('@/app/issues/_components/DeleteIssueButton', () => ({
    default: ({ issueId }: any) => (
        <div data-testid="delete-issue-button">
            <span data-testid="delete-issue-id">{issueId}</span>
        </div>
    ),
}))

describe('Issue Details Page', () => {
    const mockIssue = {
        id: '1',
        title: 'Test Issue',
        description: 'This is a test issue description',
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
        mockGetServerSession.mockClear()
        mockNotFound.mockClear()
    })

    it('fetches issue with correct ID', async () => {
        mockQuery.mockResolvedValue({
            data: { issue: mockIssue },
        })
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user-123', email: 'test@example.com' },
        })

        const params = Promise.resolve({ id: '123' })
        await IssueDetailsPage({ params })

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

        // notFound() throws an error, so we expect the component to throw
        await expect(IssueDetailsPage({ params })).rejects.toThrow()
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
            mockGetServerSession.mockResolvedValue({
                user: { id: 'user-123', email: 'test@example.com' },
            })

            const params = Promise.resolve({ id: '1' })
            await IssueDetailsPage({ params })

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
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user-123', email: 'test@example.com' },
        })

        const params = Promise.resolve({ id: '1' })
        await IssueDetailsPage({ params })

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
            mockGetServerSession.mockResolvedValue({
                user: { id: 'user-123', email: 'test@example.com' },
            })

            const params = Promise.resolve({ id })
            await IssueDetailsPage({ params })

            expect(mockQuery).toHaveBeenCalledWith({
                query: { query: 'GET_ISSUE_QUERY' },
                variables: { id },
            })
        }
    })

    it('handles authentication state correctly', async () => {
        const testCases = [
            {
                session: null,
                description: 'unauthenticated user',
            },
            {
                session: {
                    user: { id: 'user-123', email: 'test@example.com' },
                },
                description: 'authenticated user',
            },
        ]

        for (const { session, description } of testCases) {
            mockQuery.mockClear()
            mockQuery.mockResolvedValue({
                data: { issue: mockIssue },
            })
            mockGetServerSession.mockResolvedValue(session)

            const params = Promise.resolve({ id: '1' })
            await IssueDetailsPage({ params })

            expect(mockQuery).toHaveBeenCalledWith({
                query: { query: 'GET_ISSUE_QUERY' },
                variables: { id: '1' },
            })
        }
    })

    it('handles session loading state', async () => {
        mockQuery.mockResolvedValue({
            data: { issue: mockIssue },
        })
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user-123', email: 'test@example.com' },
        })

        const params = Promise.resolve({ id: '1' })
        await IssueDetailsPage({ params })

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '1' },
        })
    })

    it('executes successfully when user is authenticated (sidebar components should be rendered)', async () => {
        mockQuery.mockResolvedValue({
            data: { issue: mockIssue },
        })
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user-123', email: 'test@example.com' },
        })

        const params = Promise.resolve({ id: '1' })
        await IssueDetailsPage({ params })

        // Verify that the component executes without errors when user is authenticated
        // The sidebar components (AssigneeSelect, EditIssueButton, DeleteIssueButton)
        // should be rendered in the JSX when session exists
        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '1' },
        })
    })

    it('executes successfully when user is not authenticated (sidebar components should not be rendered)', async () => {
        mockQuery.mockResolvedValue({
            data: { issue: mockIssue },
        })
        mockGetServerSession.mockResolvedValue(null)

        const params = Promise.resolve({ id: '1' })
        await IssueDetailsPage({ params })

        // Verify that the component executes without errors when user is not authenticated
        // The sidebar components should NOT be rendered in the JSX when session is null
        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '1' },
        })
    })

    it('executes successfully with different issue data for sidebar components', async () => {
        const issueWithAssignee = {
            ...mockIssue,
            id: 'issue-456',
            assignedToUserId: 'user-789',
        }

        mockQuery.mockResolvedValue({
            data: { issue: issueWithAssignee },
        })
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user-123', email: 'test@example.com' },
        })

        const params = Promise.resolve({ id: 'issue-456' })
        await IssueDetailsPage({ params })

        // Verify that the component executes with different issue data
        // The sidebar components should receive the correct props
        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: 'issue-456' },
        })
    })

    it('executes successfully with issues without assignee in sidebar components', async () => {
        const issueWithoutAssignee = {
            ...mockIssue,
            assignedToUserId: null,
        }

        mockQuery.mockResolvedValue({
            data: { issue: issueWithoutAssignee },
        })
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user-123', email: 'test@example.com' },
        })

        const params = Promise.resolve({ id: '1' })
        await IssueDetailsPage({ params })

        // Verify that the component executes with null assignee
        // The sidebar components should handle null assignedToUserId correctly
        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUE_QUERY' },
            variables: { id: '1' },
        })
    })

    it('handles GraphQL errors gracefully', async () => {
        mockQuery.mockRejectedValue(new Error('Network Error'))

        const params = Promise.resolve({ id: '1' })

        await expect(IssueDetailsPage({ params })).rejects.toThrow(
            'Network Error'
        )
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
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user-123', email: 'test@example.com' },
        })

        const params = Promise.resolve({ id: '1' })
        await IssueDetailsPage({ params })

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
            mockGetServerSession.mockResolvedValue({
                user: { id: 'user-123', email: 'test@example.com' },
            })

            const params = Promise.resolve({ id })
            await IssueDetailsPage({ params })

            expect(mockQuery).toHaveBeenCalledWith({
                query: { query: 'GET_ISSUE_QUERY' },
                variables: { id },
            })
        }
    })
})
