import IssueChartSkeleton from '@/app/components/IssueChart/IssueChartSkeleton'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('IssueChartSkeleton', () => {
    it('should render the skeleton component', () => {
        render(<IssueChartSkeleton />)

        // Check if the component renders without errors
        expect(document.querySelector('.mt-5')).toBeInTheDocument()
    })

    it('should render chart area skeleton', () => {
        const { container } = render(<IssueChartSkeleton />)

        // Check if chart area is present
        const chartArea = container.querySelector('.w-full.h-\\[300px\\]')
        expect(chartArea).toBeInTheDocument()
    })

    it('should render skeleton placeholders for chart elements', () => {
        const { container } = render(<IssueChartSkeleton />)

        // Check if skeleton placeholders are rendered
        const skeletonElements = container.querySelectorAll('.rt-Skeleton')
        expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('should render X-axis labels skeleton', () => {
        const { container } = render(<IssueChartSkeleton />)

        // Check for X-axis labels skeleton
        const xAxisLabels = container.querySelector(
            '.flex.justify-between.mb-2'
        )
        expect(xAxisLabels).toBeInTheDocument()
    })

    it('should render bars skeleton', () => {
        const { container } = render(<IssueChartSkeleton />)

        // Check for bars skeleton
        const barsContainer = container.querySelector(
            '.flex.justify-between.items-end.h-48'
        )
        expect(barsContainer).toBeInTheDocument()
    })

    it('should render Y-axis skeleton', () => {
        const { container } = render(<IssueChartSkeleton />)

        // Check for Y-axis skeleton
        const yAxis = container.querySelector('.absolute.left-0.top-0.h-full')
        expect(yAxis).toBeInTheDocument()
    })

    it('should have proper chart dimensions', () => {
        const { container } = render(<IssueChartSkeleton />)

        // Check if the chart has the correct height
        const chartArea = container.querySelector('.h-\\[300px\\]')
        expect(chartArea).toBeInTheDocument()
    })

    it('should render multiple skeleton bars', () => {
        const { container } = render(<IssueChartSkeleton />)

        // Check for multiple skeleton bars (3 as defined in the component)
        const skeletonBars = container.querySelectorAll(
            '.flex-1.flex.flex-col.items-center'
        )
        expect(skeletonBars.length).toBe(3)
    })
})
