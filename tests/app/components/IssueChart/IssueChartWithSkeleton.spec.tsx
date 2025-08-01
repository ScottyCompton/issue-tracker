import IssueChartWithSkeleton from '@/app/components/IssueChart/IssueChartWithSkeleton'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Mock the IssueChart component
vi.mock('@/app/components/IssueChart/IssueChart', () => ({
    default: () => <div data-testid="issue-chart">Issue Chart Component</div>,
}))

// Mock the IssueChartSkeleton component
vi.mock('@/app/components/IssueChart/IssueChartSkeleton', () => ({
    default: () => (
        <div data-testid="issue-chart-skeleton">Issue Chart Skeleton</div>
    ),
}))

describe('IssueChartWithSkeleton', () => {
    it('should render skeleton when isLoading is true', () => {
        render(<IssueChartWithSkeleton isLoading={true} />)

        expect(screen.getByTestId('issue-chart-skeleton')).toBeInTheDocument()
        expect(screen.queryByTestId('issue-chart')).not.toBeInTheDocument()
    })

    it('should render IssueChart component when isLoading is false', () => {
        render(<IssueChartWithSkeleton isLoading={false} />)

        expect(screen.getByTestId('issue-chart')).toBeInTheDocument()
        expect(
            screen.queryByTestId('issue-chart-skeleton')
        ).not.toBeInTheDocument()
    })

    it('should render IssueChart component when isLoading is not provided', () => {
        render(<IssueChartWithSkeleton />)

        expect(screen.getByTestId('issue-chart')).toBeInTheDocument()
        expect(
            screen.queryByTestId('issue-chart-skeleton')
        ).not.toBeInTheDocument()
    })

    it('should handle default isLoading prop correctly', () => {
        const { rerender } = render(<IssueChartWithSkeleton />)

        // Should render IssueChart by default
        expect(screen.getByTestId('issue-chart')).toBeInTheDocument()

        // Should render skeleton when isLoading is true
        rerender(<IssueChartWithSkeleton isLoading={true} />)
        expect(screen.getByTestId('issue-chart-skeleton')).toBeInTheDocument()
    })
})
