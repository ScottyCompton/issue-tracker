import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the components
vi.mock('@/app/issues/_components/IssueDetails', () => ({
    default: ({ issue }: { issue: any }) => (
        <div data-testid="issue-details">
            <h1>{issue.title}</h1>
            <div data-testid="status-select" data-status={issue.status}>
                Status Select
            </div>
        </div>
    ),
}))

vi.mock('@/app/issues/_components/AssigneeSelect', () => ({
    default: ({
        issueId,
        assignedToUserId,
    }: {
        issueId: string
        assignedToUserId: string | null
    }) => (
        <div
            data-testid="assignee-select"
            data-issue-id={issueId}
            data-assigned-to={assignedToUserId}
        >
            Assignee Select
        </div>
    ),
}))

vi.mock('@/app/issues/_components/EditIssueButton', () => ({
    default: ({ issueId }: { issueId: string }) => (
        <button data-testid="edit-button" data-issue-id={issueId}>
            Edit
        </button>
    ),
}))

vi.mock('@/app/issues/_components/DeleteIssueButton', () => ({
    default: ({ issueId }: { issueId: string }) => (
        <button data-testid="delete-button" data-issue-id={issueId}>
            Delete
        </button>
    ),
}))

// Mock GraphQL client
const mockGraphqlClient = {
    query: vi.fn(),
}

vi.mock('@/app/lib/graphql-client', () => ({
    client: mockGraphqlClient,
}))

// Mock NextAuth
const mockGetServerSession = vi.fn()
vi.mock('next-auth', () => ({
    getServerSession: mockGetServerSession,
}))

// Mock Next.js navigation
const mockNotFound = vi.fn()
vi.mock('next/navigation', () => ({
    notFound: mockNotFound,
}))

describe('IssueDetailsPage', () => {
    const mockIssue = {
        id: '1',
        title: 'Test Issue',
        description: 'Test description',
        status: 'OPEN',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:45:00Z',
        assignedToUserId: null,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockGraphqlClient.query.mockResolvedValue({
            data: { issue: mockIssue },
        })
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user1', email: 'test@example.com' },
        })
    })

    it('fetches issue data correctly', async () => {
        const { default: IssueDetailsPage } = await import(
            '@/app/issues/[id]/page'
        )

        const params = Promise.resolve({ id: '1' })

        // Test that the component executes without throwing
        await expect(IssueDetailsPage({ params })).resolves.not.toThrow()

        // Verify that GraphQL client was called with correct parameters
        expect(mockGraphqlClient.query).toHaveBeenCalledWith({
            query: expect.any(Object),
            variables: { id: '1' },
        })
    })

    it('calls notFound when issue is not found', async () => {
        mockGraphqlClient.query.mockResolvedValue({
            data: { issue: null },
        })

        const { default: IssueDetailsPage } = await import(
            '@/app/issues/[id]/page'
        )

        const params = Promise.resolve({ id: '999' })

        // Test that the component calls notFound when issue is null
        await expect(IssueDetailsPage({ params })).rejects.toThrow()

        // Verify that notFound was called
        expect(mockNotFound).toHaveBeenCalled()
    })

    it('handles different issue statuses', async () => {
        const testCases = [
            { status: 'OPEN', title: 'Open Issue' },
            { status: 'IN_PROGRESS', title: 'In Progress Issue' },
            { status: 'CLOSED', title: 'Closed Issue' },
        ]

        for (const { status, title } of testCases) {
            mockGraphqlClient.query.mockResolvedValue({
                data: { issue: { ...mockIssue, status, title } },
            })

            const { default: IssueDetailsPage } = await import(
                '@/app/issues/[id]/page'
            )

            const params = Promise.resolve({ id: '1' })

            // Test that the component executes without throwing
            await expect(IssueDetailsPage({ params })).resolves.not.toThrow()

            // Verify that GraphQL client was called
            expect(mockGraphqlClient.query).toHaveBeenCalledWith({
                query: expect.any(Object),
                variables: { id: '1' },
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
                    user: { id: 'user1', email: 'test@example.com' },
                },
                description: 'authenticated user',
            },
        ]

        for (const { session, description } of testCases) {
            mockGraphqlClient.query.mockResolvedValue({
                data: { issue: mockIssue },
            })
            mockGetServerSession.mockResolvedValue(session)

            const { default: IssueDetailsPage } = await import(
                '@/app/issues/[id]/page'
            )

            const params = Promise.resolve({ id: '1' })

            // Test that the component executes without throwing
            await expect(IssueDetailsPage({ params })).resolves.not.toThrow()

            // Verify that GraphQL client was called
            expect(mockGraphqlClient.query).toHaveBeenCalledWith({
                query: expect.any(Object),
                variables: { id: '1' },
            })
        }
    })
})
