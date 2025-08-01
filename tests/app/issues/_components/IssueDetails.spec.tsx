import { Theme } from '@radix-ui/themes'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the IssueStatusBadge component
vi.mock('@/app/components', () => ({
    IssueStatusBadge: ({ status }: { status: string }) => (
        <div data-testid="issue-status-badge" data-status={status}>
            {status}
        </div>
    ),
}))

// Mock the StatusSelect component
vi.mock('@/app/issues/_components/StatusSelect', () => ({
    default: ({ currentStatus }: { currentStatus: string }) => (
        <div data-testid="status-select" data-status={currentStatus}>
            Status Select
        </div>
    ),
}))

// Mock the formatDate utility
const mockFormatDate = vi.fn()
vi.mock('@/app/lib/utils', () => ({
    formatDate: mockFormatDate,
}))

// Mock ReactMarkdown
vi.mock('react-markdown', () => ({
    default: ({ children }: { children: string }) => (
        <div data-testid="react-markdown">{children}</div>
    ),
}))

// Custom render function with Theme provider
const customRender = (ui: React.ReactElement) => {
    return render(<Theme>{ui}</Theme>)
}

describe('IssueDetails', () => {
    const mockIssue = {
        id: '1',
        title: 'Test Issue Title',
        description: 'This is a test issue description with **bold** text.',
        status: 'OPEN' as const,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:45:00Z',
        assignedToUserId: null,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockFormatDate.mockReturnValue('Jan 15, 2024')
    })

    it('renders issue title correctly', async () => {
        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={mockIssue} />)

        expect(screen.getByText('Test Issue Title')).toBeInTheDocument()
    })

    it('renders status select component', async () => {
        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={mockIssue} />)

        const statusSelect = screen.getByTestId('status-select')
        expect(statusSelect).toBeInTheDocument()
        expect(statusSelect).toHaveAttribute('data-status', 'OPEN')
    })

    it('renders issue status badge correctly', async () => {
        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={mockIssue} />)

        const statusBadge = screen.getByTestId('issue-status-badge')
        expect(statusBadge).toBeInTheDocument()
        expect(statusBadge).toHaveAttribute('data-status', 'OPEN')
        expect(statusBadge).toHaveTextContent('OPEN')
    })

    it('renders formatted creation date correctly', async () => {
        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={mockIssue} />)

        expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15T10:30:00Z')
        expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    })

    it('renders issue description with ReactMarkdown', async () => {
        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={mockIssue} />)

        const markdownContainer = screen.getByTestId('react-markdown')
        expect(markdownContainer).toBeInTheDocument()
        expect(markdownContainer).toHaveTextContent(
            'This is a test issue description with **bold** text.'
        )
    })

    it('handles null description gracefully', async () => {
        const issueWithNullDescription = {
            ...mockIssue,
            description: null,
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithNullDescription} />)

        const markdownContainer = screen.getByTestId('react-markdown')
        expect(markdownContainer).toBeInTheDocument()
        expect(markdownContainer).toHaveTextContent('')
    })

    it('handles empty description gracefully', async () => {
        const issueWithEmptyDescription = {
            ...mockIssue,
            description: '',
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithEmptyDescription} />)

        const markdownContainer = screen.getByTestId('react-markdown')
        expect(markdownContainer).toBeInTheDocument()
        expect(markdownContainer).toHaveTextContent('')
    })

    it('renders different status values correctly', async () => {
        const issueWithDifferentStatus = {
            ...mockIssue,
            status: 'CLOSED' as const,
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithDifferentStatus} />)

        const statusBadge = screen.getByTestId('issue-status-badge')
        expect(statusBadge).toHaveAttribute('data-status', 'CLOSED')
        expect(statusBadge).toHaveTextContent('CLOSED')
    })

    it('renders in progress status correctly', async () => {
        const issueWithInProgressStatus = {
            ...mockIssue,
            status: 'IN_PROGRESS' as const,
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithInProgressStatus} />)

        const statusBadge = screen.getByTestId('issue-status-badge')
        expect(statusBadge).toHaveAttribute('data-status', 'IN_PROGRESS')
        expect(statusBadge).toHaveTextContent('IN_PROGRESS')
    })

    it('handles different date formats correctly', async () => {
        const issueWithDifferentDate = {
            ...mockIssue,
            createdAt: '2024-02-20T14:30:00Z',
        }

        mockFormatDate.mockReturnValueOnce('Feb 20, 2024')

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithDifferentDate} />)

        expect(mockFormatDate).toHaveBeenCalledWith('2024-02-20T14:30:00Z')
        expect(screen.getByText('Feb 20, 2024')).toBeInTheDocument()
    })

    it('renders with assigned user ID', async () => {
        const issueWithAssignedUser = {
            ...mockIssue,
            assignedToUserId: 'user123',
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithAssignedUser} />)

        // The component doesn't display assignedToUserId, but it should still render
        expect(screen.getByText('Test Issue Title')).toBeInTheDocument()
        expect(screen.getByTestId('issue-status-badge')).toBeInTheDocument()
    })

    it('renders with complex markdown content', async () => {
        const issueWithComplexMarkdown = {
            ...mockIssue,
            description:
                '# Header\n\n**Bold text** and *italic text*.\n\n- List item 1\n- List item 2',
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithComplexMarkdown} />)

        const markdownContainer = screen.getByTestId('react-markdown')
        expect(markdownContainer).toBeInTheDocument()
        expect(markdownContainer).toHaveTextContent('# Header')
        expect(markdownContainer).toHaveTextContent(
            '**Bold text** and *italic text*.'
        )
        expect(markdownContainer).toHaveTextContent('- List item 1')
        expect(markdownContainer).toHaveTextContent('- List item 2')
    })

    it('renders with long title', async () => {
        const issueWithLongTitle = {
            ...mockIssue,
            title: 'This is a very long issue title that might wrap to multiple lines and should be handled gracefully by the component',
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithLongTitle} />)

        expect(
            screen.getByText(
                'This is a very long issue title that might wrap to multiple lines and should be handled gracefully by the component'
            )
        ).toBeInTheDocument()
    })

    it('renders with special characters in title', async () => {
        const issueWithSpecialChars = {
            ...mockIssue,
            title: 'Issue with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithSpecialChars} />)

        expect(
            screen.getByText(
                'Issue with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
            )
        ).toBeInTheDocument()
    })

    it('renders with HTML entities in description', async () => {
        const issueWithHtmlEntities = {
            ...mockIssue,
            description: 'Description with &lt;script&gt; and &amp; entities',
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithHtmlEntities} />)

        const markdownContainer = screen.getByTestId('react-markdown')
        expect(markdownContainer).toBeInTheDocument()
        expect(markdownContainer).toHaveTextContent(
            'Description with &lt;script&gt; and &amp; entities'
        )
    })

    it('renders with updated date', async () => {
        const issueWithUpdatedDate = {
            ...mockIssue,
            updatedAt: '2024-01-16T09:15:00Z',
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithUpdatedDate} />)

        // The component only displays createdAt, not updatedAt
        expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15T10:30:00Z')
        expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    })

    it('renders with different issue ID', async () => {
        const issueWithDifferentId = {
            ...mockIssue,
            id: '999',
        }

        const { default: IssueDetails } = await import(
            '@/app/issues/_components/IssueDetails'
        )

        customRender(<IssueDetails issue={issueWithDifferentId} />)

        // The component doesn't display the ID, but it should still render
        expect(screen.getByText('Test Issue Title')).toBeInTheDocument()
        expect(screen.getByTestId('issue-status-badge')).toBeInTheDocument()
    })
})
