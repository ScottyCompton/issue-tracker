import IssuesList from '@/app/issues/_components/IssuesList'
import { Theme } from '@radix-ui/themes'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

const renderIssuesList = (
    issues: any[],
    searchParams: Promise<any>,
    currentUser?: any
) => {
    return render(
        <Theme>
            <IssuesList
                searchParams={searchParams}
                issues={issues}
                currentUser={currentUser}
            />
        </Theme>
    )
}

describe('IssuesList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should display issues when there are issues', async () => {
        renderIssuesList(mockIssues, mockSearchParams)

        expect(screen.getByText('Test Issue 1')).toBeInTheDocument()
        expect(screen.getByText('Test Issue 2')).toBeInTheDocument()
    })

    it('should display status-based message when no issues and no user filter', async () => {
        renderIssuesList([], mockSearchParams)

        expect(screen.getByText(/No Issues with status of/)).toBeInTheDocument()
        expect(screen.getByTestId('status-badge')).toBeInTheDocument()
    })

    it('should display user-specific message when no issues and user filter is applied', async () => {
        renderIssuesList([], mockSearchParamsWithUser, mockCurrentUser)

        expect(
            screen.getByText(
                /John Doe currently has no issues assigned to them/
            )
        ).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toHaveClass('font-bold')
    })

    it('should display status-based message when user filter is applied but no currentUser is provided', async () => {
        renderIssuesList([], mockSearchParamsWithUser)

        expect(screen.getByText(/No Issues with status of/)).toBeInTheDocument()
        expect(screen.getByTestId('status-badge')).toBeInTheDocument()
    })
})
