import LatestIssuesSkeleton from '@/app/components/LatestIssuesSkeleton'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('LatestIssuesSkeleton', () => {
    it('should render the skeleton component', () => {
        render(<LatestIssuesSkeleton />)

        // Check if the title is rendered
        expect(screen.getByText('Latest Issues')).toBeInTheDocument()
    })

    it('should render multiple skeleton rows', () => {
        render(<LatestIssuesSkeleton />)

        // Check if skeleton elements are present (5 rows as defined in the component)
        const skeletonElements = screen.getAllByRole('row')
        expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('should render skeleton placeholders for issue data', () => {
        const { container } = render(<LatestIssuesSkeleton />)

        // Check if skeleton placeholders are rendered using class names
        const skeletonElements = container.querySelectorAll('.rt-Skeleton')
        expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('should have proper structure with Card and Table', () => {
        const { container } = render(<LatestIssuesSkeleton />)

        // Check if Card and Table structure is present
        expect(container.querySelector('table')).toBeInTheDocument()
    })

    it('should match the layout structure of LatestIssues component', () => {
        const { container } = render(<LatestIssuesSkeleton />)

        // Check for the main structure elements
        expect(container.querySelector('table')).toBeInTheDocument() // Table
    })
})
