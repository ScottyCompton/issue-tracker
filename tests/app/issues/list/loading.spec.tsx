import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the IssuesToolbar component
vi.mock('@/app/issues/_components/IssuesToolbar', () => ({
    default: ({ loading }: { loading: boolean }) => (
        <div data-testid="issues-toolbar" data-loading={loading}>
            Issues Toolbar
        </div>
    ),
}))

// Mock Radix UI components
vi.mock('@radix-ui/themes', () => ({
    Skeleton: ({ children, className }: any) => (
        <div data-testid="skeleton" className={className}>
            {children}
        </div>
    ),
    Table: {
        Root: ({ children, variant }: any) => (
            <table data-testid="table-root" data-variant={variant}>
                {children}
            </table>
        ),
        Header: ({ children }: any) => (
            <thead data-testid="table-header">{children}</thead>
        ),
        Row: ({ children }: any) => <tr data-testid="table-row">{children}</tr>,
        ColumnHeaderCell: ({ children, className }: any) => (
            <th data-testid="table-header-cell" className={className}>
                {children}
            </th>
        ),
        Body: ({ children }: any) => (
            <tbody data-testid="table-body">{children}</tbody>
        ),
        Cell: ({ children, className }: any) => (
            <td data-testid="table-cell" className={className}>
                {children}
            </td>
        ),
    },
}))

describe('IssuesLoadingSkeleton', () => {
    let IssuesLoadingSkeleton: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the component once per test
        const module = await import('@/app/issues/list/loading')
        IssuesLoadingSkeleton = module.default
    })

    it('can be imported successfully', () => {
        expect(IssuesLoadingSkeleton).toBeDefined()
        expect(typeof IssuesLoadingSkeleton).toBe('function')
    })

    it('renders without crashing', () => {
        render(<IssuesLoadingSkeleton />)
        expect(screen.getByTestId('issues-toolbar')).toBeInTheDocument()
        expect(screen.getByTestId('table-root')).toBeInTheDocument()
    })

    it('renders IssuesToolbar with loading prop', () => {
        render(<IssuesLoadingSkeleton />)
        const toolbar = screen.getByTestId('issues-toolbar')
        expect(toolbar).toBeInTheDocument()
        expect(toolbar.getAttribute('data-loading')).toBe('true')
    })

    it('renders table with correct variant', () => {
        render(<IssuesLoadingSkeleton />)
        const table = screen.getByTestId('table-root')
        expect(table).toBeInTheDocument()
        expect(table.getAttribute('data-variant')).toBe('surface')
    })

    it('renders table header with correct columns', () => {
        render(<IssuesLoadingSkeleton />)

        const headerCells = screen.getAllByTestId('table-header-cell')
        expect(headerCells).toHaveLength(3)

        expect(headerCells[0]).toHaveTextContent('Issue')
        expect(headerCells[1]).toHaveTextContent('Status')
        expect(headerCells[2]).toHaveTextContent('Created')
    })

    it('renders correct number of skeleton rows', () => {
        render(<IssuesLoadingSkeleton />)

        const tableRows = screen.getAllByTestId('table-row')
        // 1 header row + 5 skeleton rows = 6 total
        expect(tableRows).toHaveLength(6)
    })

    it('renders skeleton cells for each row', () => {
        render(<IssuesLoadingSkeleton />)

        const skeletons = screen.getAllByTestId('skeleton')
        // 5 rows × 4 skeletons each (3 regular + 1 mobile) = 20 skeletons
        expect(skeletons).toHaveLength(20)
    })

    it('renders responsive skeleton elements', () => {
        render(<IssuesLoadingSkeleton />)

        // Check for mobile-specific skeleton
        const skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons).toHaveLength(20)
    })

    it('has correct table structure', () => {
        render(<IssuesLoadingSkeleton />)

        expect(screen.getByTestId('table-header')).toBeInTheDocument()
        expect(screen.getByTestId('table-body')).toBeInTheDocument()
    })

    it('renders responsive column classes', () => {
        render(<IssuesLoadingSkeleton />)

        const headerCells = screen.getAllByTestId('table-header-cell')

        // Status and Created columns should be hidden on mobile
        expect(headerCells[1]).toHaveClass('hidden', 'md:table-cell')
        expect(headerCells[2]).toHaveClass('hidden', 'md:table-cell')
    })

    it('renders mobile-specific skeleton elements', () => {
        render(<IssuesLoadingSkeleton />)

        const tableCells = screen.getAllByTestId('table-cell')
        const mobileSkeleton = tableCells[0].querySelector(
            '[data-testid="skeleton"]'
        )
        expect(mobileSkeleton).toBeInTheDocument()
    })

    it('provides appropriate loading state for issues list', () => {
        render(<IssuesLoadingSkeleton />)

        // Should provide a loading state that matches the actual issues list structure
        expect(screen.getByTestId('issues-toolbar')).toBeInTheDocument()
        expect(screen.getByTestId('table-root')).toBeInTheDocument()
        expect(screen.getAllByTestId('skeleton')).toHaveLength(20)
    })

    it('maintains accessibility with proper table structure', () => {
        render(<IssuesLoadingSkeleton />)

        // Check that the table structure is maintained
        expect(screen.getByTestId('table-header')).toBeInTheDocument()
        expect(screen.getByTestId('table-body')).toBeInTheDocument()
        expect(screen.getAllByTestId('table-row')).toHaveLength(6)
    })

    it('renders consistently across multiple renders', () => {
        const { rerender } = render(<IssuesLoadingSkeleton />)

        // First render
        let skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons).toHaveLength(20)

        // Re-render
        rerender(<IssuesLoadingSkeleton />)

        // Second render should be identical
        skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons).toHaveLength(20)
    })

    it('simulates loading state for issues table', () => {
        render(<IssuesLoadingSkeleton />)

        // The component should represent a loading state for an issues table
        // with toolbar and table structure
        expect(screen.getByTestId('issues-toolbar')).toBeInTheDocument()
        expect(screen.getByTestId('table-root')).toBeInTheDocument()
        expect(screen.getAllByTestId('table-row')).toHaveLength(6)
    })

    it('follows the skeleton loading pattern', () => {
        render(<IssuesLoadingSkeleton />)

        // Should follow the standard skeleton loading pattern
        // with placeholder elements that match the expected table structure
        expect(screen.getByTestId('table-root')).toBeInTheDocument()
        expect(screen.getAllByTestId('skeleton')).toHaveLength(20)
    })
})
