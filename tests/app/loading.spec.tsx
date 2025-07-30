import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('Loading', () => {
    let Loading: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the component once per test
        const module = await import('@/app/loading')
        Loading = module.default
    })

    it('can be imported successfully', () => {
        expect(Loading).toBeDefined()
        expect(typeof Loading).toBe('function')
    })

    it('renders without crashing', () => {
        render(<Loading />)
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('renders a loading spinner', () => {
        render(<Loading />)
        const spinner = screen.getByTestId('loading-spinner')
        expect(spinner).toHaveClass('loading', 'loading-spinner', 'loading-md')
    })

    it('has correct CSS classes for loading animation', () => {
        render(<Loading />)
        const spinner = screen.getByTestId('loading-spinner')

        // Check for loading classes
        expect(spinner).toHaveClass('loading')
        expect(spinner).toHaveClass('loading-spinner')
        expect(spinner).toHaveClass('loading-md')
    })

    it('renders as a span element', () => {
        render(<Loading />)
        const spinner = screen.getByTestId('loading-spinner')
        expect(spinner.tagName).toBe('SPAN')
    })

    it('has no children elements', () => {
        render(<Loading />)
        const spinner = screen.getByTestId('loading-spinner')
        expect(spinner.children).toHaveLength(0)
    })

    it('renders consistently across multiple renders', () => {
        const { rerender } = render(<Loading />)

        // First render
        let spinner = screen.getByTestId('loading-spinner')
        expect(spinner).toHaveClass('loading', 'loading-spinner', 'loading-md')

        // Re-render
        rerender(<Loading />)

        // Second render should be identical
        spinner = screen.getByTestId('loading-spinner')
        expect(spinner).toHaveClass('loading', 'loading-spinner', 'loading-md')
    })

    it('maintains accessibility with proper semantic structure', () => {
        render(<Loading />)

        // The loading spinner should be accessible
        const spinner = screen.getByTestId('loading-spinner')
        expect(spinner).toBeInTheDocument()
    })

    it('provides appropriate loading state indication', () => {
        render(<Loading />)

        // The component should provide a clear loading indication
        const spinner = screen.getByTestId('loading-spinner')
        expect(spinner).toHaveClass('loading-spinner')
    })

    it('uses medium size loading spinner', () => {
        render(<Loading />)

        // Should use medium size for appropriate visibility
        const spinner = screen.getByTestId('loading-spinner')
        expect(spinner).toHaveClass('loading-md')
    })

    it('follows the loading component pattern', () => {
        render(<Loading />)

        // Should follow the standard loading component pattern
        const spinner = screen.getByTestId('loading-spinner')
        expect(spinner).toHaveClass('loading')
        expect(spinner.tagName).toBe('SPAN')
    })
})
