import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../../utils/test-utils'

describe('IssueStatusBadge', () => {
    it('renders OPEN status correctly', () => {
        render(<IssueStatusBadge status="OPEN" />)
        const badge = screen.getByText('Open')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveAttribute('data-accent-color', 'red')
    })

    it('renders IN_PROGRESS status correctly', () => {
        render(<IssueStatusBadge status="IN_PROGRESS" />)

        const badge = screen.getByText('In-progress')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveAttribute('data-accent-color', 'violet')
    })

    it('renders CLOSED status correctly', () => {
        render(<IssueStatusBadge status="CLOSED" />)

        const badge = screen.getByText('Closed')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveAttribute('data-accent-color', 'green')
    })

    it('displays correct labels for each status', () => {
        const { rerender } = render(<IssueStatusBadge status="OPEN" />)

        // Test OPEN status
        expect(screen.getByText('Open')).toBeInTheDocument()

        // Test IN_PROGRESS status
        rerender(<IssueStatusBadge status="IN_PROGRESS" />)
        expect(screen.getByText('In-progress')).toBeInTheDocument()

        // Test CLOSED status
        rerender(<IssueStatusBadge status="CLOSED" />)
        expect(screen.getByText('Closed')).toBeInTheDocument()
    })

    it('applies correct colors for each status', () => {
        const { rerender } = render(<IssueStatusBadge status="OPEN" />)

        // Test OPEN status (red)
        let badge = screen.getByText('Open')
        expect(badge).toHaveAttribute('data-accent-color', 'red')

        // Test IN_PROGRESS status (violet)
        rerender(<IssueStatusBadge status="IN_PROGRESS" />)
        badge = screen.getByText('In-progress')
        expect(badge).toHaveAttribute('data-accent-color', 'violet')

        // Test CLOSED status (green)
        rerender(<IssueStatusBadge status="CLOSED" />)
        badge = screen.getByText('Closed')
        expect(badge).toHaveAttribute('data-accent-color', 'green')
    })

    it('renders as a Badge component', () => {
        render(<IssueStatusBadge status="OPEN" />)

        const badge = screen.getByText('Open')
        expect(badge.tagName).toBe('SPAN')
        expect(badge).toHaveClass('rt-Badge')
    })
})
