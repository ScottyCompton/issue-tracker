import IssuesListTable, {
    IssueListTableColumn,
} from '@/app/issues/_components/IssuesListTable'
import { IssueType, Status } from '@/prisma/client'
import { fireEvent, render, screen } from '@/tests/utils/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('@/app/components', () => ({
    IssueStatusBadge: vi.fn(({ status }) => (
        <span data-testid="status-badge">{status}</span>
    )),
    Link: vi.fn(({ children, href }) => <a href={href}>{children}</a>),
    ProjectBadge: vi.fn(({ project, variant }) => (
        <span data-testid="project-badge" data-variant={variant}>
            {project?.name || 'No Project'}
        </span>
    )),
}))
vi.mock('@/app/lib/utils', () => ({
    formatDate: vi.fn((date) =>
        date instanceof Date ? date.toLocaleDateString() : 'Invalid Date'
    ),
}))
vi.mock('radix-ui/react-icons', () => ({
    ArrowDownIcon: vi.fn(() => <span data-testid="arrow-down">↓</span>),
    ArrowUpIcon: vi.fn(() => <span data-testid="arrow-up">↑</span>),
}))
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: any }) => (
        <a href={typeof href === 'string' ? href : href.pathname}>{children}</a>
    ),
}))
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
        ColumnHeaderCell: vi.fn(({ children, style, key, className }: any) => (
            <th
                data-testid="table-column-header"
                style={style}
                data-key={key}
                className={className}
            >
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

const columns: IssueListTableColumn[] = [
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

const mockIssues = [
    {
        id: 1,
        title: 'Test Issue 1',
        status: 'OPEN' as Status,
        issueType: 'GENERAL' as IssueType,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        assignedToUserId: undefined,
        assignedToUser: undefined,
    },
    {
        id: 2,
        title: 'Test Issue 2',
        status: 'IN_PROGRESS' as Status,
        issueType: 'BUG' as IssueType,
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

const formatIssueType = (issueType: string) =>
    issueType.charAt(0) + issueType.slice(1).toLowerCase()

describe('IssuesListTable', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders with issues', () => {
        render(
            <IssuesListTable
                columns={columns}
                issues={mockIssues}
                status="OPEN"
                sortBy="title"
                sortOrder="asc"
                page="1"
                pageSize="10"
                userId={undefined}
                currentUser={mockCurrentUser}
                formatIssueType={formatIssueType}
            />
        )
        expect(screen.getByTestId('table-root')).toBeInTheDocument()
        expect(screen.getByTestId('table-header')).toBeInTheDocument()
        expect(screen.getByTestId('table-body')).toBeInTheDocument()
        expect(screen.getAllByTestId('table-row').length).toBeGreaterThan(0)
        expect(screen.getAllByTestId('table-column-header')).toHaveLength(4)
        expect(screen.getAllByRole('link')).toHaveLength(2)
        expect(screen.getAllByTestId('status-badge')).toHaveLength(4)
    })

    it('renders empty state', () => {
        render(
            <IssuesListTable
                columns={columns}
                issues={[]}
                status="OPEN"
                sortBy="title"
                sortOrder="asc"
                page="1"
                pageSize="10"
                userId={undefined}
                currentUser={mockCurrentUser}
                formatIssueType={formatIssueType}
            />
        )
        expect(screen.getByTestId('table-root')).toBeInTheDocument()
        expect(screen.getByTestId('table-cell')).toHaveTextContent(
            'No Issues with status of OPEN found'
        )
    })

    it('renders empty state with user filter and current user', () => {
        render(
            <IssuesListTable
                columns={columns}
                issues={[]}
                status="OPEN"
                sortBy="title"
                sortOrder="asc"
                page="1"
                pageSize="10"
                userId="user123"
                currentUser={mockCurrentUser}
                formatIssueType={formatIssueType}
            />
        )
        expect(screen.getByTestId('table-root')).toBeInTheDocument()
        expect(screen.getByTestId('table-cell')).toHaveTextContent(
            'John Doe currently has no issues assigned to them.'
        )
    })

    it('renders sorting icons', () => {
        render(
            <IssuesListTable
                columns={columns}
                issues={mockIssues}
                status="OPEN"
                sortBy="title"
                sortOrder="asc"
                page="1"
                pageSize="10"
                userId={undefined}
                currentUser={mockCurrentUser}
                formatIssueType={formatIssueType}
            />
        )
        // Check for SVG with class 'inline' in the first column header
        const columnHeaders = screen.getAllByTestId('table-column-header')
        const svg = columnHeaders[0].querySelector('svg.inline')
        expect(svg).not.toBeNull()
    })

    it.skip('renders correct sort link href', () => {
        render(
            <IssuesListTable
                columns={columns}
                issues={mockIssues}
                status="OPEN"
                sortBy="title"
                sortOrder="asc"
                page="1"
                pageSize="10"
                userId={undefined}
                currentUser={mockCurrentUser}
                formatIssueType={formatIssueType}
            />
        )
        const columnHeaders = screen.getAllByTestId('table-column-header')
        const link = columnHeaders[0].querySelector('a')
        expect(link).toBeTruthy()
        // The href should contain 'sortBy=title' and 'sortOrder=desc'
        expect(link?.getAttribute('href')).toContain('sortBy=title')
        expect(link?.getAttribute('href')).toContain('sortOrder=desc')
    })

    it.skip('calls onSort when a column header is clicked', () => {
        const onSort = vi.fn()
        render(
            <IssuesListTable
                columns={columns}
                issues={mockIssues}
                status="OPEN"
                sortBy="title"
                sortOrder="asc"
                page="1"
                pageSize="10"
                userId={undefined}
                currentUser={mockCurrentUser}
                formatIssueType={formatIssueType}
                onSort={onSort}
            />
        )
        const columnHeaders = screen.getAllByTestId('table-column-header')
        fireEvent.click(columnHeaders[0].querySelector('a')!)
        expect(onSort).toHaveBeenCalled()
    })

    it('renders formatted issue types', () => {
        render(
            <IssuesListTable
                columns={columns}
                issues={mockIssues}
                status="OPEN"
                sortBy="title"
                sortOrder="asc"
                page="1"
                pageSize="10"
                userId={undefined}
                currentUser={mockCurrentUser}
                formatIssueType={formatIssueType}
            />
        )
        expect(
            screen
                .getAllByTestId('table-cell')
                .some(
                    (cell) =>
                        cell.textContent?.includes('General') ||
                        cell.textContent?.includes('Bug')
                )
        ).toBe(true)
    })
})
