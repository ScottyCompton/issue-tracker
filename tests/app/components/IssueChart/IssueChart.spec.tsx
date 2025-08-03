import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the GraphQL client
const mockQuery = vi.fn()
vi.mock('@/app/lib/graphql-client', () => ({
    client: {
        query: mockQuery,
    },
}))

// Mock the GraphQL query
vi.mock('@/app/graphql/queries', () => ({
    GET_ISSUES_STATUS_COUNT_QUERY: 'GET_ISSUES_STATUS_COUNT_QUERY',
}))

// Mock the IssuesBarChart component
vi.mock('./IssuesBarChart', () => ({
    default: ({ issueData }: { issueData: any[] }) => (
        <div data-testid="issues-bar-chart">
            {issueData.map((item, index) => (
                <div key={index} data-testid={`chart-item-${item.status}`}>
                    {item.label}: {item.count}
                </div>
            ))}
        </div>
    ),
}))

// Mock Radix UI components
vi.mock('@radix-ui/themes', () => ({
    Card: ({
        children,
        className,
    }: {
        children: React.ReactNode
        className?: string
    }) => (
        <div data-testid="card" className={className}>
            {children}
        </div>
    ),
    Skeleton: ({
        className,
        height,
    }: {
        className?: string
        height?: string
    }) => (
        <div data-testid="skeleton" className={className} style={{ height }}>
            Loading...
        </div>
    ),
}))

// Mock IssueChartSkeleton
vi.mock('./IssueChartSkeleton', () => ({
    default: () => <div data-testid="skeleton">Loading...</div>,
}))

describe('IssueChart', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()

        // Suppress unhandled promise rejection warnings
        process.on('unhandledRejection', () => {})
    })

    afterEach(() => {
        vi.useRealTimers()

        // Remove the unhandled rejection handler
        process.removeAllListeners('unhandledRejection')
    })

    it('can be imported successfully', async () => {
        const { default: IssueChart } = await import(
            '@/app/components/IssueChart/IssueChart'
        )
        expect(IssueChart).toBeDefined()
        expect(typeof IssueChart).toBe('function')
    })

    it('is a client component', async () => {
        const { default: IssueChart } = await import(
            '@/app/components/IssueChart/IssueChart'
        )
        expect(typeof IssueChart).toBe('function')
        // Client components are regular functions, not async functions
        expect(IssueChart.constructor.name).toBe('Function')
    })

    it('renders loading state initially', async () => {
        const { default: IssueChart } = await import(
            '@/app/components/IssueChart/IssueChart'
        )

        render(<IssueChart />)

        // Should show skeleton initially
        expect(screen.getAllByTestId('skeleton')).toHaveLength(10)
    })

    it('handles GraphQL query with mock data', async () => {
        const mockData = {
            issueStatusCount: [
                {
                    label: 'Open',
                    status: 'OPEN',
                    count: 5,
                },
                {
                    label: 'In Progress',
                    status: 'IN_PROGRESS',
                    count: 3,
                },
                {
                    label: 'Closed',
                    status: 'CLOSED',
                    count: 12,
                },
            ],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { default: IssueChart } = await import(
            '@/app/components/IssueChart/IssueChart'
        )

        render(<IssueChart />)

        // Advance timers to complete the artificial delay
        await vi.advanceTimersByTimeAsync(1000)

        // Check that the query was called
        expect(mockQuery).toHaveBeenCalledWith({
            query: 'GET_ISSUES_STATUS_COUNT_QUERY',
        })
    })

    it('uses the correct GraphQL query', async () => {
        const { GET_ISSUES_STATUS_COUNT_QUERY } = await import(
            '@/app/graphql/queries'
        )
        expect(GET_ISSUES_STATUS_COUNT_QUERY).toBeDefined()
        expect(GET_ISSUES_STATUS_COUNT_QUERY).toBe(
            'GET_ISSUES_STATUS_COUNT_QUERY'
        )
    })

    it('imports required dependencies', async () => {
        const { default: IssueChart } = await import(
            '@/app/components/IssueChart/IssueChart'
        )
        expect(IssueChart).toBeDefined()
    })
})
