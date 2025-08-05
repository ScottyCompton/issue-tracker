import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../../utils/test-utils'

describe('IssueStatusBadge', () => {
    it('renders OPEN status correctly', () => {
        render(<IssueStatusBadge status="OPEN" />)
        const badge = screen.getByText('Open')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('renders IN_PROGRESS status correctly', () => {
        render(<IssueStatusBadge status="IN_PROGRESS" />)

        const badge = screen.getByText('In-progress')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveClass('bg-violet-100', 'text-violet-800')
    })

    it('renders CLOSED status correctly', () => {
        render(<IssueStatusBadge status="CLOSED" />)

        const badge = screen.getByText('Closed')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveClass('bg-green-100', 'text-green-800')
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
        expect(badge).toHaveClass('bg-red-100', 'text-red-800')

        // Test IN_PROGRESS status (violet)
        rerender(<IssueStatusBadge status="IN_PROGRESS" />)
        badge = screen.getByText('In-progress')
        expect(badge).toHaveClass('bg-violet-100', 'text-violet-800')

        // Test CLOSED status (green)
        rerender(<IssueStatusBadge status="CLOSED" />)
        badge = screen.getByText('Closed')
        expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('renders as a Text component', () => {
        render(<IssueStatusBadge status="OPEN" />)

        const badge = screen.getByText('Open')
        expect(badge.tagName).toBe('SPAN')
        expect(badge).toHaveClass('rt-Text')
    })
})
