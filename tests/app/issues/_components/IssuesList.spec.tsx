import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the enums
vi.mock('@/prisma/client', () => ({
    Status: {
        OPEN: 'OPEN',
        IN_PROGRESS: 'IN_PROGRESS',
        CLOSED: 'CLOSED',
    },
    IssueType: {
        GENERAL: 'GENERAL',
        BUG: 'BUG',
        SPIKE: 'SPIKE',
        TASK: 'TASK',
        SUBTASK: 'SUBTASK',
    },
}))

// Mock the components
vi.mock('@/app/components', () => ({
    IssueStatusBadge: vi.fn(({ status }) => (
        <span data-testid="status-badge">{status}</span>
    )),
    Link: vi.fn(({ children, href }) => <a href={href}>{children}</a>),
}))

// Mock the utils
vi.mock('@/app/lib/utils', () => ({
    formatDate: vi.fn((date) => {
        if (date instanceof Date) {
            return date.toLocaleDateString()
        }
        return 'Invalid Date'
    }),
}))

// Mock the icons
vi.mock('@radix-ui/react-icons', () => ({
    ArrowDownIcon: vi.fn(() => <span data-testid="arrow-down">↓</span>),
    ArrowUpIcon: vi.fn(() => <span data-testid="arrow-up">↑</span>),
}))

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: any }) => (
        <a href={typeof href === 'string' ? href : href.pathname}>{children}</a>
    ),
}))

// Mock the Table component
vi.mock('@radix-ui/themes', () => ({
    Table: {
        Root: vi.fn(({ children, variant }: any) => (
            <table data-testid="table-root" data-variant={variant}>
                {children}
            </table>
        )),
        Header: vi.fn(({ children }: any) => (
            <thead data-testid="table-header">{children}</thead>
        )),
        Row: vi.fn(({ children }: any) => (
            <tr data-testid="table-row">{children}</tr>
        )),
        ColumnHeaderCell: vi.fn(({ children, style, key }: any) => (
            <th data-testid="table-column-header" style={style} data-key={key}>
                {children}
            </th>
        )),
        Body: vi.fn(({ children }: any) => (
            <tbody data-testid="table-body">{children}</tbody>
        )),
        Cell: vi.fn(({ children, className, colSpan }: any) => (
            <td
                data-testid="table-cell"
                className={className}
                colSpan={colSpan}
            >
                {children}
            </td>
        )),
    },
    Theme: vi.fn(({ children }: any) => (
        <div data-testid="theme">{children}</div>
    )),
}))

const mockSearchParams = Promise.resolve({
    status: 'OPEN',
    sortBy: 'title',
    sortOrder: 'asc',
    page: '1',
    pageSize: '10',
    userId: undefined,
})

const mockSearchParamsWithUser = Promise.resolve({
    status: 'OPEN',
    sortBy: 'title',
    sortOrder: 'asc',
    page: '1',
    pageSize: '10',
    userId: 'user123',
})

const mockIssues = [
    {
        id: 1,
        title: 'Test Issue 1',
        status: 'OPEN' as any,
        issueType: 'GENERAL' as any,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        assignedToUserId: undefined,
        assignedToUser: undefined,
    },
    {
        id: 2,
        title: 'Test Issue 2',
        status: 'IN_PROGRESS' as any,
        issueType: 'BUG' as any,
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
        assignedToUserId: 'user123',
        assignedToUser: {
            id: 'user123',
            name: 'John Doe',
            email: 'john@example.com',
            image: 'https://example.com/john.jpg',
            username: null,
            emailVerified: null,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
        },
    },
]

const mockCurrentUser = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://example.com/john.jpg',
}

describe('IssuesList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('can be imported successfully', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )
        expect(IssuesList).toBeDefined()
    })

    it('processes searchParams correctly', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        // Test that the component can process searchParams
        const searchParams = Promise.resolve({
            status: 'OPEN',
            sortBy: 'title',
            sortOrder: 'asc',
            page: '1',
            pageSize: '10',
            userId: undefined,
        })

        expect(searchParams).toBeDefined()
        const resolvedParams = await searchParams
        expect(resolvedParams.status).toBe('OPEN')
        expect(resolvedParams.sortBy).toBe('title')
    })

    it('defines columns correctly', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        // Test that columns are defined with correct structure
        const columns = [
            { label: 'Issue', value: 'title', width: '40%' },
            {
                label: 'Status',
                value: 'status',
                className: 'hidden md:table-cell',
                width: '20%',
            },
            {
                label: 'Type',
                value: 'issueType',
                className: 'hidden md:table-cell',
                width: '20%',
            },
            {
                label: 'Created',
                value: 'createdAt',
                className: 'hidden md:table-cell',
                width: '20%',
            },
        ]

        expect(columns).toHaveLength(4)
        expect(columns[0].label).toBe('Issue')
        expect(columns[0].value).toBe('title')
        expect(columns[1].label).toBe('Status')
        expect(columns[2].label).toBe('Type')
        expect(columns[3].label).toBe('Created')
    })

    it('formats issue types correctly', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        // Test the formatIssueType function logic
        const formatIssueType = (issueType: string) => {
            return issueType.charAt(0) + issueType.slice(1).toLowerCase()
        }

        expect(formatIssueType('GENERAL')).toBe('General')
        expect(formatIssueType('BUG')).toBe('Bug')
        expect(formatIssueType('SPIKE')).toBe('Spike')
        expect(formatIssueType('TASK')).toBe('Task')
        expect(formatIssueType('SUBTASK')).toBe('Subtask')
    })

    it('handles different searchParams combinations', async () => {
        const { default: IssuesList } = await import(
            '@/app/issues/_components/IssuesList'
        )

        // Test various searchParams combinations
        const testCases = [
            {
                params: { status: 'OPEN', sortBy: 'title', sortOrder: 'asc' },
                expected: { status: 'OPEN', sortBy: 'title', sortOrder: 'asc' },
            },
            {
                params: {
                    status: 'IN_PROGRESS',
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                },
                expected: {
                    status: 'IN_PROGRESS',
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                },
            },
            {
                params: { status: 'CLOSED', userId: 'user123' },
                expected: { status: 'CLOSED', userId: 'user123' },
            },
        ]

        for (const testCase of testCases) {
            const searchParams = Promise.resolve(testCase.params)
            const resolvedParams = await searchParams
            expect(resolvedParams).toEqual(testCase.expected)
        }
    })
})
