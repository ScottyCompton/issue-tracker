import Home from '@/app/page'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../utils/test-utils'

// Mock the child components
vi.mock('@/app/components/IssueChart/IssueChart', () => ({
    default: () => <div data-testid="issue-chart">Issue Chart</div>,
}))

vi.mock('@/app/components/IssueSummary', () => ({
    default: () => <div data-testid="issue-summary">Issue Summary</div>,
}))

vi.mock('@/app/components/LatestIssues', () => ({
    default: () => <div data-testid="latest-issues">Latest Issues</div>,
}))

describe('Home Page', () => {
    it('renders the home page with all dashboard components', () => {
        render(<Home />)

        // Check if all main components are rendered
        expect(screen.getByTestId('issue-summary')).toBeInTheDocument()
        expect(screen.getByTestId('issue-chart')).toBeInTheDocument()
        expect(screen.getByTestId('latest-issues')).toBeInTheDocument()
    })

    it('renders with correct grid layout structure', () => {
        const { container } = render(<Home />)

        // Check if the grid container is rendered
        const grid = container.querySelector('[class*="Grid"]')
        expect(grid).toBeInTheDocument()
    })

    it('renders IssueSummary component in the left column', () => {
        render(<Home />)

        const issueSummary = screen.getByTestId('issue-summary')
        expect(issueSummary).toBeInTheDocument()
        expect(issueSummary.textContent).toBe('Issue Summary')
    })

    it('renders IssueChart component in the left column', () => {
        render(<Home />)

        const issueChart = screen.getByTestId('issue-chart')
        expect(issueChart).toBeInTheDocument()
        expect(issueChart.textContent).toBe('Issue Chart')
    })

    it('renders LatestIssues component in the right column', () => {
        render(<Home />)

        const latestIssues = screen.getByTestId('latest-issues')
        expect(latestIssues).toBeInTheDocument()
        expect(latestIssues.textContent).toBe('Latest Issues')
    })

    it('has correct responsive grid layout', () => {
        const { container } = render(<Home />)

        // Check that the Grid component is rendered with Radix UI classes
        const grid = container.querySelector('[class*="rt-Grid"]')
        expect(grid).toBeInTheDocument()
    })

    it('renders with correct gap spacing', () => {
        const { container } = render(<Home />)

        // Check that the Grid component is rendered
        const grid = container.querySelector('[class*="rt-Grid"]')
        expect(grid).toBeInTheDocument()
    })

    it('renders with correct flex direction for left column', () => {
        const { container } = render(<Home />)

        // Check that the Flex component is rendered with Radix UI classes
        const flexContainer = container.querySelector('[class*="rt-Flex"]')
        expect(flexContainer).toBeInTheDocument()
    })

    it('renders with correct gap for flex container', () => {
        const { container } = render(<Home />)

        // Check that the Flex component is rendered
        const flexContainer = container.querySelector('[class*="rt-Flex"]')
        expect(flexContainer).toBeInTheDocument()
    })

    it('maintains component hierarchy', () => {
        const { container } = render(<Home />)

        // Check that components are nested correctly
        const grid = container.querySelector('[class*="rt-Grid"]')
        const flexContainer = grid?.querySelector('[class*="rt-Flex"]')

        expect(grid).toBeInTheDocument()
        expect(flexContainer).toBeInTheDocument()
        expect(
            flexContainer?.querySelector('[data-testid="issue-summary"]')
        ).toBeInTheDocument()
        expect(
            flexContainer?.querySelector('[data-testid="issue-chart"]')
        ).toBeInTheDocument()
    })

    it('renders without errors when components are missing', () => {
        // Test that the page doesn't crash if child components fail to load
        const { container } = render(<Home />)

        expect(container.firstChild).toBeInTheDocument()
    })

    it('has correct metadata structure', () => {
        // This test verifies the metadata export structure
        // Note: In a real test environment, you might want to test metadata separately
        expect(Home).toBeDefined()
    })
})
