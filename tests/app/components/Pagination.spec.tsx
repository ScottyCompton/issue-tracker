import Pagination from '@/app/components/Pagination'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../../utils/test-utils'

// Mock next/navigation
const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams('page=1')

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => mockSearchParams,
}))

describe('Pagination', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchParams.set('page', '1')
    })

    it('renders pagination controls when page count is greater than 1', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={1} />)

        expect(screen.getByText('Page 1 of 5')).toBeInTheDocument()
        const buttons = screen.getAllByRole('button')
        expect(buttons).toHaveLength(4)
    })

    it('renders with item count when page count is 1 or less', () => {
        const { container } = render(
            <Pagination itemCount={5} pageSize={10} currentPage={1} />
        )

        // Check that item count text is rendered instead of page count
        expect(screen.getByText('5 items')).toBeInTheDocument()
    })

    it('displays correct page information', () => {
        render(<Pagination itemCount={25} pageSize={5} currentPage={3} />)

        expect(screen.getByText('Page 3 of 5')).toBeInTheDocument()
    })

    it('displays item count when only one page', () => {
        render(<Pagination itemCount={5} pageSize={10} currentPage={1} />)

        expect(screen.getByText('5 items')).toBeInTheDocument()
    })

    it('disables first and previous buttons on first page', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={1} />)

        const buttons = screen.getAllByRole('button')
        const firstPageButton = buttons[0] // First button (double arrow left)
        const previousButton = buttons[1] // Second button (single arrow left)

        expect(firstPageButton).toBeDisabled()
        expect(previousButton).toBeDisabled()
    })

    it('disables next and last buttons on last page', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={5} />)

        const buttons = screen.getAllByRole('button')
        const nextButton = buttons[2] // Third button (single arrow right)
        const lastPageButton = buttons[3] // Fourth button (double arrow right)

        expect(nextButton).toBeDisabled()
        expect(lastPageButton).toBeDisabled()
    })

    it('enables all buttons on middle page', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={3} />)

        const buttons = screen.getAllByRole('button')
        const firstPageButton = buttons[0]
        const previousButton = buttons[1]
        const nextButton = buttons[2]
        const lastPageButton = buttons[3]

        expect(firstPageButton).not.toBeDisabled()
        expect(previousButton).not.toBeDisabled()
        expect(nextButton).not.toBeDisabled()
        expect(lastPageButton).not.toBeDisabled()
    })

    it('calls router.push with correct parameters when first page button is clicked', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={3} />)

        const buttons = screen.getAllByRole('button')
        const firstPageButton = buttons[0]
        fireEvent.click(firstPageButton)

        expect(mockPush).toHaveBeenCalledWith('?page=1')
    })

    it('calls router.push with correct parameters when previous button is clicked', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={3} />)

        const buttons = screen.getAllByRole('button')
        const previousButton = buttons[1]
        fireEvent.click(previousButton)

        expect(mockPush).toHaveBeenCalledWith('?page=2')
    })

    it('calls router.push with correct parameters when next button is clicked', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={3} />)

        const buttons = screen.getAllByRole('button')
        const nextButton = buttons[2]
        fireEvent.click(nextButton)

        expect(mockPush).toHaveBeenCalledWith('?page=4')
    })

    it('calls router.push with correct parameters when last page button is clicked', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={3} />)

        const buttons = screen.getAllByRole('button')
        const lastPageButton = buttons[3]
        fireEvent.click(lastPageButton)

        expect(mockPush).toHaveBeenCalledWith('?page=5')
    })

    it('preserves existing search parameters when changing pages', () => {
        mockSearchParams.set('status', 'OPEN')
        mockSearchParams.set('page', '2')

        render(<Pagination itemCount={50} pageSize={10} currentPage={2} />)

        const buttons = screen.getAllByRole('button')
        const nextButton = buttons[2]
        fireEvent.click(nextButton)

        expect(mockPush).toHaveBeenCalledWith('?page=3&status=OPEN')
    })

    it('handles edge case with exact page size division', () => {
        render(<Pagination itemCount={100} pageSize={10} currentPage={10} />)

        expect(screen.getByText('Page 10 of 10')).toBeInTheDocument()
        const buttons = screen.getAllByRole('button')
        const nextButton = buttons[2]
        const lastPageButton = buttons[3]
        expect(nextButton).toBeDisabled()
        expect(lastPageButton).toBeDisabled()
    })

    it('handles edge case with remainder items', () => {
        render(<Pagination itemCount={23} pageSize={10} currentPage={3} />)

        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument()
        const buttons = screen.getAllByRole('button')
        const nextButton = buttons[2]
        const lastPageButton = buttons[3]
        expect(nextButton).toBeDisabled()
        expect(lastPageButton).toBeDisabled()
    })

    it('renders with correct layout structure', () => {
        const { container } = render(
            <Pagination itemCount={50} pageSize={10} currentPage={1} />
        )

        const flexContainer = container.querySelector('[class*="rt-Flex"]')
        expect(flexContainer).toBeInTheDocument()
    })

    it('does not call router.push when disabled buttons are clicked', () => {
        render(<Pagination itemCount={50} pageSize={10} currentPage={1} />)

        const buttons = screen.getAllByRole('button')
        const firstPageButton = buttons[0]
        const previousButton = buttons[1]

        fireEvent.click(firstPageButton)
        fireEvent.click(previousButton)

        expect(mockPush).not.toHaveBeenCalled()
    })
})
