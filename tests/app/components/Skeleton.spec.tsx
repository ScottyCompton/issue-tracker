import Skeleton from '@/app/components/Skeleton'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../../utils/test-utils'

describe('Skeleton', () => {
    it('renders skeleton loading state', () => {
        const { container } = render(<Skeleton />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
    })

    it('renders with custom width', () => {
        const width = 200
        const { container } = render(<Skeleton width={width} />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle(`width: ${width}px`)
    })

    it('renders with custom height', () => {
        const height = 50
        const { container } = render(<Skeleton height={height} />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle(`height: ${height}px`)
    })

    it('renders with custom count', () => {
        const count = 3
        const { container } = render(<Skeleton count={count} />)

        const skeletons = container.querySelectorAll('.react-loading-skeleton')
        expect(skeletons).toHaveLength(count)
    })

    it('renders with custom baseColor', () => {
        const baseColor = '#f0f0f0'
        const { container } = render(<Skeleton baseColor={baseColor} />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle(`--base-color: ${baseColor}`)
    })

    it('renders with custom highlightColor', () => {
        const highlightColor = '#e0e0e0'
        const { container } = render(
            <Skeleton highlightColor={highlightColor} />
        )

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle(`--highlight-color: ${highlightColor}`)
    })

    it('renders with custom duration', () => {
        const duration = 2
        const { container } = render(<Skeleton duration={duration} />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle(`--animation-duration: ${duration}s`)
    })

    it('renders with custom borderRadius', () => {
        const borderRadius = 8
        const { container } = render(<Skeleton borderRadius={borderRadius} />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle(`border-radius: ${borderRadius}px`)
    })

    it('renders with custom className', () => {
        const className = 'custom-skeleton'
        const { container } = render(<Skeleton className={className} />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveClass(className)
    })

    it('renders with custom style', () => {
        const style = { backgroundColor: 'red' }
        const { container } = render(<Skeleton style={style} />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle('background-color: rgb(255, 0, 0)')
    })

    it('renders with custom containerClassName', () => {
        const containerClassName = 'custom-container'
        const { container } = render(
            <Skeleton containerClassName={containerClassName} />
        )

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()

        // Check that the container has the custom class
        const skeletonContainer = skeleton?.parentElement
        expect(skeletonContainer).toHaveClass(containerClassName)
    })

    it('renders with custom containerTestId', () => {
        const containerTestId = 'custom-skeleton-container'
        render(<Skeleton containerTestId={containerTestId} />)

        const skeleton = screen.getByTestId(containerTestId)
        expect(skeleton).toBeInTheDocument()
    })

    it('renders with custom circle shape', () => {
        const { container } = render(<Skeleton circle />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle('border-radius: 50%')
    })

    it('renders with custom enableAnimation', () => {
        const { container } = render(<Skeleton enableAnimation={false} />)

        const skeleton = container.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveStyle('--pseudo-element-display: none')
    })
})
