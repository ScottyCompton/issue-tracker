import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the Skeleton component
vi.mock('@/app/components', () => ({
    Skeleton: ({ height }: { height: string }) => (
        <div data-testid="skeleton" data-height={height} />
    ),
}))

// Mock Radix UI Box component
vi.mock('@radix-ui/themes', () => ({
    Box: ({
        children,
        className,
    }: {
        children: React.ReactNode
        className?: string
    }) => (
        <div data-testid="box" className={className}>
            {children}
        </div>
    ),
}))

describe('IssueFormSkeleton', () => {
    let IssueFormSkeleton: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the component once per test
        const module = await import(
            '@/app/issues/_components/IssueFormSkeleton'
        )
        IssueFormSkeleton = module.default
    })

    it('can be imported successfully', () => {
        expect(IssueFormSkeleton).toBeDefined()
        expect(typeof IssueFormSkeleton).toBe('function')
    })

    it('renders without crashing', () => {
        render(<IssueFormSkeleton />)
        expect(screen.getByTestId('box')).toBeInTheDocument()
    })

    it('renders with correct container class', () => {
        render(<IssueFormSkeleton />)
        const box = screen.getByTestId('box')
        expect(box).toHaveClass('max-w-xl')
    })

    it('renders two skeleton components', () => {
        render(<IssueFormSkeleton />)
        const skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons).toHaveLength(2)
    })

    it('renders first skeleton with correct height', () => {
        render(<IssueFormSkeleton />)
        const skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons[0]).toHaveAttribute('data-height', '2rem')
    })

    it('renders second skeleton with correct height', () => {
        render(<IssueFormSkeleton />)
        const skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons[1]).toHaveAttribute('data-height', '20rem')
    })

    it('has correct component structure', () => {
        render(<IssueFormSkeleton />)

        // Check that the box container is rendered
        const box = screen.getByTestId('box')
        expect(box).toBeInTheDocument()

        // Check that both skeletons are rendered inside the box
        const skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons).toHaveLength(2)

        // Verify skeletons are children of the box
        expect(box).toContainElement(skeletons[0])
        expect(box).toContainElement(skeletons[1])
    })

    it('applies correct styling classes', () => {
        render(<IssueFormSkeleton />)
        const box = screen.getByTestId('box')
        expect(box).toHaveClass('max-w-xl')
    })

    it('renders skeletons in correct order', () => {
        render(<IssueFormSkeleton />)
        const skeletons = screen.getAllByTestId('skeleton')

        // First skeleton should be for title/header (2rem)
        expect(skeletons[0]).toHaveAttribute('data-height', '2rem')

        // Second skeleton should be for content/description (20rem)
        expect(skeletons[1]).toHaveAttribute('data-height', '20rem')
    })

    it('simulates loading state for issue form', () => {
        render(<IssueFormSkeleton />)

        // The component should represent a loading state for an issue form
        // with a title skeleton and a content skeleton
        const box = screen.getByTestId('box')
        const skeletons = screen.getAllByTestId('skeleton')

        expect(box).toBeInTheDocument()
        expect(skeletons).toHaveLength(2)
    })

    it('maintains accessibility with proper structure', () => {
        render(<IssueFormSkeleton />)

        // Check that the skeleton structure is maintained
        const box = screen.getByTestId('box')
        const skeletons = screen.getAllByTestId('skeleton')

        expect(box).toContainElement(skeletons[0])
        expect(box).toContainElement(skeletons[1])
    })

    it('uses correct skeleton heights for form elements', () => {
        render(<IssueFormSkeleton />)
        const skeletons = screen.getAllByTestId('skeleton')

        // The heights should be appropriate for form elements
        // 2rem for title/input field
        // 20rem for description/textarea
        expect(skeletons[0]).toHaveAttribute('data-height', '2rem')
        expect(skeletons[1]).toHaveAttribute('data-height', '20rem')
    })

    it('renders consistently across multiple renders', () => {
        const { rerender } = render(<IssueFormSkeleton />)

        // First render
        let skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons).toHaveLength(2)

        // Re-render
        rerender(<IssueFormSkeleton />)

        // Second render should be identical
        skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons).toHaveLength(2)
        expect(skeletons[0]).toHaveAttribute('data-height', '2rem')
        expect(skeletons[1]).toHaveAttribute('data-height', '20rem')
    })

    it('provides appropriate loading state dimensions', () => {
        render(<IssueFormSkeleton />)
        const skeletons = screen.getAllByTestId('skeleton')

        // The skeleton should provide appropriate dimensions for a form
        // that would typically have a title field and a description field
        expect(skeletons[0]).toHaveAttribute('data-height', '2rem') // Title/input height
        expect(skeletons[1]).toHaveAttribute('data-height', '20rem') // Description/textarea height
    })

    it('follows the skeleton loading pattern', () => {
        render(<IssueFormSkeleton />)

        // The component should follow the standard skeleton loading pattern
        // with placeholder elements that match the expected form structure
        const box = screen.getByTestId('box')
        const skeletons = screen.getAllByTestId('skeleton')

        expect(box).toBeInTheDocument()
        expect(skeletons).toHaveLength(2)

        // Verify the skeleton represents a form with title and content areas
        expect(skeletons[0]).toHaveAttribute('data-height', '2rem') // Compact height for title
        expect(skeletons[1]).toHaveAttribute('data-height', '20rem') // Large height for content
    })
})
