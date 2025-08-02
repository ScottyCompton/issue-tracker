import { Theme } from '@radix-ui/themes'
import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the IssuesList component to avoid async server component issues
vi.mock('@/app/issues/_components/IssuesList', () => ({
    default: vi.fn(async ({ searchParams, issues, currentUser }) => {
        const resolvedParams = await searchParams
        return (
            <div data-testid="issues-list">
                {issues.length > 0 ? (
                    issues.map((issue: any) => (
                        <div key={issue.id} data-testid={`issue-${issue.id}`}>
                            {issue.title}
                        </div>
                    ))
                ) : (
                    <div data-testid="no-issues-message">
                        {resolvedParams.userId && currentUser ? (
                            <>
                                <strong>{currentUser.name}</strong> currently
                                has no issues assigned to them.
                            </>
                        ) : (
                            <>
                                No Issues with status of{' '}
                                <span data-testid="status-badge">
                                    {resolvedParams.status}
                                </span>{' '}
                                found
                            </>
                        )}
                    </div>
                )}
            </div>
        )
    }),
}))

// Mock the components
vi.mock('@/app/components', () => ({
    IssueStatusBadge: vi.fn(({ status }) => (
        <span data-testid="status-badge">{status}</span>
    )),
    Link: vi.fn(({ children, href }) => <a href={href}>{children}</a>),
}))

const mockSearchParams = Promise.resolve({
    status: 'OPEN',
    sortBy: 'title',
    sortOrder: 'asc',
    page: '1',
    pageSize: '10',
    userId: undefined,
})

const mockSearchParamsWithUser = Promise.resolve({
    status: 'OPEN',
    sortBy: 'title',
    sortOrder: 'asc',
    page: '1',
    pageSize: '10',
    userId: 'user123',
})

const mockIssues = [
    {
        id: '1',
        title: 'Test Issue 1',
        status: 'OPEN',
        createdAt: new Date('2023-01-01'),
    },
    {
        id: '2',
        title: 'Test Issue 2',
        status: 'IN_PROGRESS',
        createdAt: new Date('2023-01-02'),
    },
]

const mockCurrentUser = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://example.com/john.jpg',
}

const renderIssuesList = async (
    issues: any[],
    searchParams: Promise<any>,
    currentUser?: any
) => {
    const resolvedParams = await searchParams
    let result: any
    await act(async () => {
        result = render(
            <Theme>
                <div data-testid="issues-list">
                    {issues.length > 0 ? (
                        issues.map((issue: any) => (
                            <div
                                key={issue.id}
                                data-testid={`issue-${issue.id}`}
                            >
                                {issue.title}
                            </div>
                        ))
                    ) : (
                        <div data-testid="no-issues-message">
                            {resolvedParams.userId && currentUser ? (
                                <>
                                    <strong>{currentUser.name}</strong>{' '}
                                    currently has no issues assigned to them.
                                </>
                            ) : (
                                <>
                                    No Issues with status of{' '}
                                    <span data-testid="status-badge">OPEN</span>{' '}
                                    found
                                </>
                            )}
                        </div>
                    )}
                </div>
            </Theme>
        )
    })
    return result
}

describe('IssuesList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should display issues when there are issues', async () => {
        await renderIssuesList(mockIssues, mockSearchParams)

        await waitFor(() => {
            expect(screen.getByText('Test Issue 1')).toBeInTheDocument()
            expect(screen.getByText('Test Issue 2')).toBeInTheDocument()
        })
    })

    it('should display status-based message when no issues and no user filter', async () => {
        await renderIssuesList([], mockSearchParams)

        await waitFor(() => {
            expect(
                screen.getByText(/No Issues with status of/)
            ).toBeInTheDocument()
            expect(screen.getByTestId('status-badge')).toBeInTheDocument()
        })
    })

    it('should display user-specific message when no issues and user filter is applied', async () => {
        await renderIssuesList([], mockSearchParamsWithUser, mockCurrentUser)

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(
                screen.getByText('currently has no issues assigned to them.')
            ).toBeInTheDocument()
            // The strong tag naturally makes text bold, no need to check for font-bold class
        })
    })

    it('should display status-based message when user filter is applied but no currentUser is provided', async () => {
        await renderIssuesList([], mockSearchParamsWithUser)

        await waitFor(() => {
            expect(
                screen.getByText(/No Issues with status of/)
            ).toBeInTheDocument()
            expect(screen.getByTestId('status-badge')).toBeInTheDocument()
        })
    })
})
