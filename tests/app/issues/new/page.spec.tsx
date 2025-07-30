import IssuePage from '@/app/issues/new/page'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '../../../utils/test-utils'

// Mock the IssueForm component
vi.mock('@/app/issues/_components/IssueForm', () => ({
    default: ({ issue }: any) => (
        <div data-testid="issue-form">
            {issue ? (
                <>
                    <span data-testid="issue-id">{issue.id}</span>
                    <span data-testid="issue-title">{issue.title}</span>
                </>
            ) : (
                <span data-testid="new-issue-form">New Issue Form</span>
            )}
        </div>
    ),
}))

// Mock the IssueFormSkeleton component
vi.mock('@/app/issues/_components/IssueFormSkeleton', () => ({
    default: () => <div data-testid="issue-form-skeleton">Loading...</div>,
}))

// Mock Next.js dynamic import
vi.mock('next/dynamic', () => ({
    default: () => {
        const MockIssueForm = () => (
            <div data-testid="issue-form">New Issue Form</div>
        )
        return MockIssueForm
    },
}))

describe('New Issue Page', () => {
    beforeEach(() => {
        // Clear any previous mocks if needed
    })

    it('renders the new issue page', () => {
        const { container } = render(<IssuePage />)

        // The page should render without errors
        expect(container.firstChild).toBeInTheDocument()
    })

    it('renders the issue form component', () => {
        render(<IssuePage />)

        // Should render the IssueForm component
        expect(screen.getByTestId('issue-form')).toBeInTheDocument()
    })

    it('renders new issue form without issue prop', () => {
        render(<IssuePage />)

        // Should render the new issue form (no issue prop)
        expect(screen.getByTestId('issue-form')).toBeInTheDocument()
        expect(screen.getByText('New Issue Form')).toBeInTheDocument()
    })

    it('does not render loading skeleton by default', () => {
        render(<IssuePage />)

        // Should not show loading skeleton in normal rendering
        expect(
            screen.queryByTestId('issue-form-skeleton')
        ).not.toBeInTheDocument()
    })

    it('renders without any props', () => {
        render(<IssuePage />)

        // Should render without errors
        expect(screen.getByTestId('issue-form')).toBeInTheDocument()
    })

    it('maintains consistent rendering', () => {
        const { rerender } = render(<IssuePage />)

        const firstRender = screen.getByTestId('issue-form')
        expect(firstRender).toBeInTheDocument()

        rerender(<IssuePage />)

        const secondRender = screen.getByTestId('issue-form')
        expect(secondRender).toBeInTheDocument()
    })
})
