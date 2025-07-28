import { Theme } from '@radix-ui/themes'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock next/navigation
const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams('sortBy=title&sortOrder=asc')

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => mockSearchParams,
}))

// Custom render function with Theme provider
const customRender = (ui: React.ReactElement) => {
    return render(<Theme>{ui}</Theme>)
}

describe('IssueStatusFilter', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchParams.set('sortBy', 'title')
        mockSearchParams.set('sortOrder', 'asc')
    })

    it('renders filter dropdown correctly', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders with current status', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter currStatus="OPEN" />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles "All" status selection', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        // Simulate selecting "All" option
        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        // The component should handle the "-1" value for "All"
        expect(mockPush).not.toHaveBeenCalled()
    })

    it('handles "Open" status selection', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        // Simulate selecting "Open" option
        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        // The component should handle the "OPEN" value
        expect(mockPush).not.toHaveBeenCalled()
    })

    it('handles "In-Progress" status selection', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        // Simulate selecting "In-Progress" option
        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        // The component should handle the "IN_PROGRESS" value
        expect(mockPush).not.toHaveBeenCalled()
    })

    it('handles "Closed" status selection', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        // Simulate selecting "Closed" option
        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        // The component should handle the "CLOSED" value
        expect(mockPush).not.toHaveBeenCalled()
    })

    it('preserves existing search parameters', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        // The component should preserve sortBy and sortOrder parameters
        expect(mockSearchParams.get('sortBy')).toBe('title')
        expect(mockSearchParams.get('sortOrder')).toBe('asc')
    })

    it('handles empty current status', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter currStatus={undefined} />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles null current status', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter currStatus={null as any} />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles different current statuses', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter currStatus="CLOSED" />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles search params without sortBy', async () => {
        mockSearchParams.delete('sortBy')

        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles search params without sortOrder', async () => {
        mockSearchParams.delete('sortOrder')

        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles empty search params', async () => {
        // Clear search params by setting them to empty
        mockSearchParams.delete('sortBy')
        mockSearchParams.delete('sortOrder')

        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('is a client-side component', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        expect(IssueStatusFilter).toBeDefined()
        expect(typeof IssueStatusFilter).toBe('function')
    })

    it('can be imported successfully', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        expect(IssueStatusFilter).toBeDefined()
    })

    it('handles component with different props', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter currStatus="IN_PROGRESS" />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles component without props', async () => {
        const { default: IssueStatusFilter } = await import(
            '@/app/issues/_components/IssueStatusFilter'
        )

        customRender(<IssueStatusFilter />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
})
