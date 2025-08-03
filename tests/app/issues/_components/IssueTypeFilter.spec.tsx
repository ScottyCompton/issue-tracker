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

// Mock the IssueType enum
vi.mock('@/app/generated/prisma', () => ({
    IssueType: {
        GENERAL: 'GENERAL',
        BUG: 'BUG',
        SPIKE: 'SPIKE',
        TASK: 'TASK',
        SUBTASK: 'SUBTASK',
    },
}))

// Custom render function with Theme provider
const customRender = (ui: React.ReactElement) => {
    return render(<Theme>{ui}</Theme>)
}

describe('IssueTypeFilter', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders with placeholder text', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        customRender(<IssueTypeFilter />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByText('Filter by type...')).toBeInTheDocument()
    })

    it('renders with current issue type', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        customRender(<IssueTypeFilter currIssueType="BUG" />)

        const select = screen.getByRole('combobox')
        expect(select).toBeInTheDocument()
        expect(screen.getByText('Bug')).toBeInTheDocument()
    })

    it('renders all issue type options', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        customRender(<IssueTypeFilter />)

        // Open the dropdown
        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        // Check that all options are present
        expect(screen.getByText('All')).toBeInTheDocument()
        expect(screen.getByText('General')).toBeInTheDocument()
        expect(screen.getByText('Bug')).toBeInTheDocument()
        expect(screen.getByText('Spike')).toBeInTheDocument()
        expect(screen.getByText('Task')).toBeInTheDocument()
        expect(screen.getByText('Subtask')).toBeInTheDocument()
    })

    it('handles selection change', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        customRender(<IssueTypeFilter />)

        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        // Select "Bug"
        const bugOption = screen.getByText('Bug')
        fireEvent.click(bugOption)

        expect(mockPush).toHaveBeenCalledWith(
            '/issues/list?issueType=BUG&sortBy=title&sortOrder=asc'
        )
    })

    it('handles "All" selection', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        customRender(<IssueTypeFilter currIssueType="BUG" />)

        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        // Select "All"
        const allOption = screen.getByText('All')
        fireEvent.click(allOption)

        expect(mockPush).toHaveBeenCalledWith(
            '/issues/list?sortBy=title&sortOrder=asc'
        )
    })

    it('preserves existing query parameters', async () => {
        const { handleSelect } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )
        const mockRouter = { push: vi.fn() }
        const mockSearchParams = new URLSearchParams(
            'status=OPEN&sortBy=title&sortOrder=asc'
        )

        handleSelect('BUG', mockSearchParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list?issueType=BUG&status=OPEN&sortBy=title&sortOrder=asc'
        )
    })

    it('can be imported successfully', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        expect(IssueTypeFilter).toBeDefined()
    })

    it('is a client-side component', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        expect(typeof IssueTypeFilter).toBe('function')
    })

    it('renders with undefined current issue type', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        customRender(<IssueTypeFilter currIssueType={undefined} />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByText('Filter by type...')).toBeInTheDocument()
    })

    it('renders with null current issue type', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        customRender(<IssueTypeFilter currIssueType={null as any} />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders with empty string current issue type', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        customRender(<IssueTypeFilter currIssueType="" />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByText('Filter by type...')).toBeInTheDocument()
    })

    it('handles different issue type values', async () => {
        const { default: IssueTypeFilter } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        const issueTypes = ['GENERAL', 'BUG', 'SPIKE', 'TASK', 'SUBTASK']
        const labels = ['General', 'Bug', 'Spike', 'Task', 'Subtask']

        issueTypes.forEach((type, index) => {
            const { unmount } = customRender(
                <IssueTypeFilter currIssueType={type} />
            )
            expect(screen.getByText(labels[index])).toBeInTheDocument()
            unmount()
        })
    })

    it('exports handleSelect function for testing', async () => {
        const { handleSelect } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )

        expect(typeof handleSelect).toBe('function')
    })

    it('handleSelect function works correctly', async () => {
        const { handleSelect } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )
        const mockRouter = { push: vi.fn() }
        const mockSearchParams = new URLSearchParams('status=OPEN&sortBy=title')

        handleSelect('BUG', mockSearchParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list?issueType=BUG&status=OPEN&sortBy=title'
        )
    })

    it('handleSelect function handles "All" selection', async () => {
        const { handleSelect } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )
        const mockRouter = { push: vi.fn() }
        const mockSearchParams = new URLSearchParams('status=OPEN&sortBy=title')

        handleSelect('-1', mockSearchParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list?status=OPEN&sortBy=title'
        )
    })

    it('handleSelect function preserves all query parameters', async () => {
        const { handleSelect } = await import(
            '@/app/issues/_components/IssueTypeFilter'
        )
        const mockRouter = { push: vi.fn() }
        const mockSearchParams = new URLSearchParams(
            'status=OPEN&sortBy=title&sortOrder=asc&page=1&pageSize=10&userId=123'
        )

        handleSelect('TASK', mockSearchParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list?issueType=TASK&status=OPEN&sortBy=title&sortOrder=asc&page=1&pageSize=10&userId=123'
        )
    })
})
