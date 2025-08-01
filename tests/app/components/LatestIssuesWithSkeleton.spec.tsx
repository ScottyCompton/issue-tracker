import LatestIssuesWithSkeleton from '@/app/components/LatestIssuesWithSkeleton'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Mock the LatestIssues component
vi.mock('@/app/components/LatestIssues', () => ({
    default: () => (
        <div data-testid="latest-issues">Latest Issues Component</div>
    ),
}))

// Mock the LatestIssuesSkeleton component
vi.mock('@/app/components/LatestIssuesSkeleton', () => ({
    default: () => (
        <div data-testid="latest-issues-skeleton">Latest Issues Skeleton</div>
    ),
}))

describe('LatestIssuesWithSkeleton', () => {
    it('should render skeleton when isLoading is true', () => {
        render(<LatestIssuesWithSkeleton isLoading={true} />)

        expect(screen.getByTestId('latest-issues-skeleton')).toBeInTheDocument()
        expect(screen.queryByTestId('latest-issues')).not.toBeInTheDocument()
    })

    it('should render LatestIssues component when isLoading is false', () => {
        render(<LatestIssuesWithSkeleton isLoading={false} />)

        expect(screen.getByTestId('latest-issues')).toBeInTheDocument()
        expect(
            screen.queryByTestId('latest-issues-skeleton')
        ).not.toBeInTheDocument()
    })

    it('should render LatestIssues component when isLoading is not provided', () => {
        render(<LatestIssuesWithSkeleton />)

        expect(screen.getByTestId('latest-issues')).toBeInTheDocument()
        expect(
            screen.queryByTestId('latest-issues-skeleton')
        ).not.toBeInTheDocument()
    })

    it('should handle default isLoading prop correctly', () => {
        const { rerender } = render(<LatestIssuesWithSkeleton />)

        // Should render LatestIssues by default
        expect(screen.getByTestId('latest-issues')).toBeInTheDocument()

        // Should render skeleton when isLoading is true
        rerender(<LatestIssuesWithSkeleton isLoading={true} />)
        expect(screen.getByTestId('latest-issues-skeleton')).toBeInTheDocument()
    })
})
