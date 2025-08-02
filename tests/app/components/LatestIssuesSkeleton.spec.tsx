import LatestIssuesSkeleton from '@/app/components/LatestIssuesSkeleton'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('LatestIssuesSkeleton', () => {
    it('should render the skeleton component', () => {
        const { container } = render(<LatestIssuesSkeleton />)

        // Check if the title skeleton is rendered (not actual text)
        const titleSkeleton = container.querySelector(
            '.rt-Skeleton.rt-r-h.max-w-xs.mb-5'
        )
        expect(titleSkeleton).toBeInTheDocument()
    })

    it('should render multiple skeleton rows', () => {
        const { container } = render(<LatestIssuesSkeleton />)

        // Check if skeleton elements are present (5 rows as defined in the component)
        // Now looking for Flex containers instead of table rows
        const skeletonRows = container.querySelectorAll(
            '.rt-Flex.rt-r-ai-center.rt-r-jc-space-between'
        )
        expect(skeletonRows.length).toBeGreaterThan(0)
    })

    it('should render skeleton placeholders for issue data', () => {
        const { container } = render(<LatestIssuesSkeleton />)

        // Check if skeleton placeholders are rendered using class names
        const skeletonElements = container.querySelectorAll('.rt-Skeleton')
        expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('should have proper structure with Card and Flex layout', () => {
        const { container } = render(<LatestIssuesSkeleton />)

        // Check if Card structure is present
        expect(container.querySelector('.rt-Card')).toBeInTheDocument()
        // Check if Flex layout is present
        expect(
            container.querySelector('.rt-Flex.rt-r-fd-column')
        ).toBeInTheDocument()
    })

    it('should match the layout structure of LatestIssues component', () => {
        const { container } = render(<LatestIssuesSkeleton />)

        // Check for the main structure elements - now using Flex instead of Table
        expect(container.querySelector('.rt-Card')).toBeInTheDocument() // Card
        expect(
            container.querySelector('.rt-Flex.rt-r-fd-column')
        ).toBeInTheDocument() // Flex container
    })
})
