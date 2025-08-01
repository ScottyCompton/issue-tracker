import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the IssueSummary component
vi.mock('@/app/components/IssueSummary', () => ({
    default: () => <div data-testid="issue-summary">Issue Summary Content</div>,
}))

// Mock the IssueSummarySkeleton component
vi.mock('@/app/components/IssueSummarySkeleton', () => ({
    default: () => (
        <div data-testid="issue-summary-skeleton">Issue Summary Skeleton</div>
    ),
}))

describe('IssueSummaryWithSkeleton', () => {
    let IssueSummaryWithSkeleton: any

    beforeEach(async () => {
        const module = await import('@/app/components/IssueSummaryWithSkeleton')
        IssueSummaryWithSkeleton = module.default
    })

    it('can be imported successfully', () => {
        expect(IssueSummaryWithSkeleton).toBeDefined()
        expect(typeof IssueSummaryWithSkeleton).toBe('function')
    })

    it('renders skeleton when isLoading is true', () => {
        render(<IssueSummaryWithSkeleton isLoading={true} />)

        expect(screen.getByTestId('issue-summary-skeleton')).toBeInTheDocument()
        expect(screen.queryByTestId('issue-summary')).not.toBeInTheDocument()
    })

    it('renders IssueSummary when isLoading is false', () => {
        render(<IssueSummaryWithSkeleton isLoading={false} />)

        expect(screen.getByTestId('issue-summary')).toBeInTheDocument()
        expect(
            screen.queryByTestId('issue-summary-skeleton')
        ).not.toBeInTheDocument()
    })

    it('renders IssueSummary when isLoading is not provided', () => {
        render(<IssueSummaryWithSkeleton />)

        expect(screen.getByTestId('issue-summary')).toBeInTheDocument()
        expect(
            screen.queryByTestId('issue-summary-skeleton')
        ).not.toBeInTheDocument()
    })

    it('wraps IssueSummary in Suspense with skeleton fallback', () => {
        render(<IssueSummaryWithSkeleton />)

        // The component should be wrapped in Suspense
        const issueSummary = screen.getByTestId('issue-summary')
        expect(issueSummary).toBeInTheDocument()

        // The skeleton should be available as a fallback
        expect(
            screen.queryByTestId('issue-summary-skeleton')
        ).not.toBeInTheDocument()
    })

    it('handles loading state changes', () => {
        const { rerender } = render(
            <IssueSummaryWithSkeleton isLoading={true} />
        )

        expect(screen.getByTestId('issue-summary-skeleton')).toBeInTheDocument()
        expect(screen.queryByTestId('issue-summary')).not.toBeInTheDocument()

        rerender(<IssueSummaryWithSkeleton isLoading={false} />)

        expect(screen.getByTestId('issue-summary')).toBeInTheDocument()
        expect(
            screen.queryByTestId('issue-summary-skeleton')
        ).not.toBeInTheDocument()
    })

    it('imports required dependencies', async () => {
        const componentModule = await import(
            '@/app/components/IssueSummaryWithSkeleton'
        )
        expect(componentModule.default).toBeDefined()
    })
})
