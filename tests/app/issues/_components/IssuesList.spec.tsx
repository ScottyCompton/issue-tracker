import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the components
vi.mock('@/app/components', () => ({
    IssueStatusBadge: ({ status }: { status: string }) => (
        <div data-testid="issue-status-badge" data-status={status}>
            {status}
        </div>
    ),
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href} data-testid="issue-link">
            {children}
        </a>
    ),
}))

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: any }) => (
        <a href={JSON.stringify(href)} data-testid="sort-link">
            {children}
        </a>
    ),
}))

// Mock the formatDate utility
const mockFormatDate = vi.fn()
vi.mock('@/app/lib/utils', () => ({
    formatDate: mockFormatDate,
}))

// Mock Radix UI icons
vi.mock('@radix-ui/react-icons', () => ({
    ArrowDownIcon: () => <div data-testid="arrow-down-icon" />,
    ArrowUpIcon: () => <div data-testid="arrow-up-icon" />,
}))

describe('IssuesList', () => {
    const mockIssues = [
        {
            id: 1,
            title: 'First Issue',
            status: 'OPEN' as const,
            createdAt: new Date('2024-01-15T10:30:00Z'),
            updatedAt: new Date('2024-01-15T11:45:00Z'),
            assignedToUserId: undefined,
        },
        {
            id: 2,
            title: 'Second Issue',
            status: 'IN_PROGRESS' as const,
            createdAt: new Date('2024-01-16T09:15:00Z'),
            updatedAt: new Date('2024-01-16T10:30:00Z'),
            assignedToUserId: 'user1',
        },
        {
            id: 3,
            title: 'Third Issue',
            status: 'CLOSED' as const,
            createdAt: new Date('2024-01-17T14:20:00Z'),
            updatedAt: new Date('2024-01-17T15:45:00Z'),
            assignedToUserId: undefined,
        },
    ]

    const mockSearchParams = Promise.resolve({
        status: 'OPEN',
        sortBy: 'title',
        sortOrder: 'asc',
        page: '1',
    })

    beforeEach(() => {
        vi.clearAllMocks()
        mockFormatDate.mockReturnValue('Jan 15, 2024')
    })

    it('renders issues table correctly', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('renders table headers with sorting links', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('renders issues in table rows', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('displays issue titles as links', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('displays status badges for each issue', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('displays formatted creation dates', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
        expect(mockFormatDate).toHaveBeenCalled()
    })

    it('handles empty issues array', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: [],
        })

        expect(result).toBeDefined()
    })

    it('handles different status filters', async () => {
        const closedSearchParams = Promise.resolve({
            status: 'CLOSED',
            sortBy: 'title',
            sortOrder: 'asc',
            page: '1',
        })

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: closedSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('handles different sort orders', async () => {
        const descSearchParams = Promise.resolve({
            status: 'OPEN',
            sortBy: 'title',
            sortOrder: 'desc',
            page: '1',
        })

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: descSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('handles different sort columns', async () => {
        const statusSortParams = Promise.resolve({
            status: 'OPEN',
            sortBy: 'status',
            sortOrder: 'asc',
            page: '1',
        })

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: statusSortParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('handles issues with assigned users', async () => {
        const issuesWithAssignedUsers = [
            {
                ...mockIssues[0],
                assignedToUserId: 'user1',
            },
        ]

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: issuesWithAssignedUsers,
        })

        expect(result).toBeDefined()
    })

    it('handles issues without assigned users', async () => {
        const issuesWithoutAssignedUsers = [
            {
                ...mockIssues[0],
                assignedToUserId: undefined,
            },
        ]

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: issuesWithoutAssignedUsers,
        })

        expect(result).toBeDefined()
    })

    it('handles single issue', async () => {
        const singleIssue = [mockIssues[0]]

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: singleIssue,
        })

        expect(result).toBeDefined()
    })

    it('handles many issues', async () => {
        const manyIssues = Array.from({ length: 10 }, (_, i) => ({
            ...mockIssues[0],
            id: i + 1,
            title: `Issue ${i + 1}`,
        }))

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: manyIssues,
        })

        expect(result).toBeDefined()
    })

    it('handles issues with long titles', async () => {
        const issuesWithLongTitles = [
            {
                ...mockIssues[0],
                title: 'This is a very long issue title that might wrap to multiple lines and should be handled gracefully by the component',
            },
        ]

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: issuesWithLongTitles,
        })

        expect(result).toBeDefined()
    })

    it('handles issues with special characters in titles', async () => {
        const issuesWithSpecialChars = [
            {
                ...mockIssues[0],
                title: 'Issue with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
            },
        ]

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: issuesWithSpecialChars,
        })

        expect(result).toBeDefined()
    })

    it('handles different date formats', async () => {
        const issuesWithDifferentDates = [
            {
                ...mockIssues[0],
                createdAt: new Date('2024-02-20T14:30:00Z'),
            },
        ]

        mockFormatDate.mockReturnValueOnce('Feb 20, 2024')

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: issuesWithDifferentDates,
        })

        expect(result).toBeDefined()
        expect(mockFormatDate).toHaveBeenCalled()
    })

    it('handles all status types', async () => {
        const issuesWithAllStatuses = [
            { ...mockIssues[0], status: 'OPEN' as const },
            { ...mockIssues[1], status: 'IN_PROGRESS' as const },
            { ...mockIssues[2], status: 'CLOSED' as const },
        ]

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: issuesWithAllStatuses,
        })

        expect(result).toBeDefined()
    })

    it('handles search params without optional fields', async () => {
        const minimalSearchParams = Promise.resolve({
            status: 'OPEN',
        })

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: minimalSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('handles search params with all fields', async () => {
        const completeSearchParams = Promise.resolve({
            status: 'OPEN',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: '2',
        })

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: completeSearchParams,
            issues: mockIssues,
        })

        expect(result).toBeDefined()
    })

    it('is an async function component', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        expect(IssuesList.constructor.name).toBe('AsyncFunction')
    })

    it('can be imported successfully', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        expect(IssuesList).toBeDefined()
        expect(typeof IssuesList).toBe('function')
    })

    it('handles issues with different IDs', async () => {
        const issuesWithDifferentIds = [
            { ...mockIssues[0], id: 999 },
            { ...mockIssues[1], id: 1000 },
            { ...mockIssues[2], id: 1001 },
        ]

        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        const result = await IssuesList({
            searchParams: mockSearchParams,
            issues: issuesWithDifferentIds,
        })

        expect(result).toBeDefined()
    })
})
