import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the Skeleton component from Radix UI
vi.mock('@radix-ui/themes', async () => {
    const actual = await vi.importActual('@radix-ui/themes')
    return {
        ...actual,
        Skeleton: ({ children, className, height }: any) => (
            <div
                data-testid="skeleton"
                className={className}
                data-height={height}
            >
                {children}
            </div>
        ),
        Card: ({ children, className }: any) => (
            <div data-testid="card" className={className}>
                {children}
            </div>
        ),
        Flex: ({ children, direction, gap, className }: any) => (
            <div
                data-testid="flex"
                data-direction={direction}
                data-gap={gap}
                className={className}
            >
                {children}
            </div>
        ),
    }
})

describe('IssueSummarySkeleton', () => {
    let IssueSummarySkeleton: any

    beforeEach(async () => {
        const module = await import('@/app/components/IssueSummarySkeleton')
        IssueSummarySkeleton = module.default
    })

    it('can be imported successfully', () => {
        expect(IssueSummarySkeleton).toBeDefined()
        expect(typeof IssueSummarySkeleton).toBe('function')
    })

    it('renders without crashing', () => {
        render(<IssueSummarySkeleton />)
        const flexElements = screen.getAllByTestId('flex')
        expect(flexElements.length).toBeGreaterThan(0)
    })

    it('renders the main container with correct structure', () => {
        render(<IssueSummarySkeleton />)

        const flexElements = screen.getAllByTestId('flex')
        const mainFlex = flexElements.find(
            (el) =>
                el.getAttribute('data-direction') === 'column' &&
                el.classList.contains('w-full')
        )
        expect(mainFlex).toBeInTheDocument()
        expect(mainFlex).toHaveAttribute('data-direction', 'column')
        expect(mainFlex).toHaveClass('w-full')
    })

    it('renders title skeleton with correct styling', () => {
        render(<IssueSummarySkeleton />)

        const skeletons = screen.getAllByTestId('skeleton')
        const titleSkeleton = skeletons[0]

        expect(titleSkeleton).toBeInTheDocument()
        expect(titleSkeleton).toHaveClass('max-w-xs', 'mb-5')
        expect(titleSkeleton).toHaveAttribute('data-height', '1.5rem')
    })

    it('renders three skeleton cards', () => {
        render(<IssueSummarySkeleton />)

        const cards = screen.getAllByTestId('card')
        expect(cards).toHaveLength(3)

        cards.forEach((card) => {
            expect(card).toHaveClass('flex-1', 'w-full')
        })
    })

    it('renders skeleton content within each card', () => {
        render(<IssueSummarySkeleton />)

        const skeletons = screen.getAllByTestId('skeleton')
        // Should have 1 title skeleton + 3 cards × 2 skeletons each = 7 total
        expect(skeletons).toHaveLength(7)

        // Check that we have the correct number of flex containers
        const flexContainers = screen.getAllByTestId('flex')
        expect(flexContainers).toHaveLength(5) // 1 main container + 1 for cards layout + 3 for card content
    })

    it('renders cards layout with correct gap', () => {
        render(<IssueSummarySkeleton />)

        const flexContainers = screen.getAllByTestId('flex')
        const cardsLayout = flexContainers.find(
            (el) => el.getAttribute('data-gap') === '3'
        )

        expect(cardsLayout).toBeInTheDocument()
        expect(cardsLayout).toHaveAttribute('data-gap', '3')
        expect(cardsLayout).toHaveClass('w-full')
    })

    it('renders skeleton content with appropriate heights', () => {
        render(<IssueSummarySkeleton />)

        const skeletons = screen.getAllByTestId('skeleton')

        // Title skeleton should have 1.5rem height
        expect(skeletons[0]).toHaveAttribute('data-height', '1.5rem')

        // Card content skeletons should have appropriate heights
        const cardSkeletons = skeletons.slice(1) // Skip title skeleton
        cardSkeletons.forEach((skeleton, index) => {
            if (index % 2 === 0) {
                // First skeleton in each card (label)
                expect(skeleton).toHaveAttribute('data-height', '1rem')
                expect(skeleton).toHaveClass('text-xs')
            } else {
                // Second skeleton in each card (count)
                expect(skeleton).toHaveAttribute('data-height', '1.5rem')
                expect(skeleton).toHaveClass('text-lg')
            }
        })
    })

    it('follows the skeleton loading pattern', () => {
        render(<IssueSummarySkeleton />)

        // Should have the standard skeleton structure
        const flexElements = screen.getAllByTestId('flex')
        expect(flexElements.length).toBeGreaterThan(0)
        expect(screen.getAllByTestId('card')).toHaveLength(3)
        expect(screen.getAllByTestId('skeleton')).toHaveLength(7)
    })

    it('uses appropriate skeleton dimensions', () => {
        render(<IssueSummarySkeleton />)

        const skeletons = screen.getAllByTestId('skeleton')

        // Title skeleton should have max width and margin
        expect(skeletons[0]).toHaveClass('max-w-xs', 'mb-5')
        expect(skeletons[0]).toHaveAttribute('data-height', '1.5rem')

        // Card content should have appropriate text sizes
        const cardSkeletons = skeletons.slice(1)
        cardSkeletons.forEach((skeleton, index) => {
            if (index % 2 === 0) {
                expect(skeleton).toHaveClass('text-xs')
                expect(skeleton).toHaveAttribute('data-height', '1rem')
            } else {
                expect(skeleton).toHaveClass('text-lg')
                expect(skeleton).toHaveAttribute('data-height', '1.5rem')
            }
        })
    })

    it('maintains consistent structure across renders', () => {
        const { rerender } = render(<IssueSummarySkeleton />)

        const initialSkeletons = screen.getAllByTestId('skeleton')
        const initialCards = screen.getAllByTestId('card')

        rerender(<IssueSummarySkeleton />)

        const rerenderSkeletons = screen.getAllByTestId('skeleton')
        const rerenderCards = screen.getAllByTestId('card')

        expect(rerenderSkeletons).toHaveLength(initialSkeletons.length)
        expect(rerenderCards).toHaveLength(initialCards.length)
    })

    it('imports required dependencies', async () => {
        const componentModule = await import(
            '@/app/components/IssueSummarySkeleton'
        )
        expect(componentModule.default).toBeDefined()
    })
})
