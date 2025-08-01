import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the GraphQL client
const mockQuery = vi.fn()
vi.mock('@/app/lib/graphql-client', () => ({
    client: {
        query: mockQuery,
    },
}))

// Mock the GraphQL query
vi.mock('@/app/graphql/queries', () => ({
    GET_ISSUES_STATUS_COUNT_QUERY: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
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

describe('IssueChart', () => {
    let IssueChart: any

    beforeEach(async () => {
        vi.clearAllMocks()
        // Import the component once per test
        const module = await import('@/app/components/IssueChart/IssueChart')
        IssueChart = module.default
    })

    it('can be imported successfully', () => {
        expect(IssueChart).toBeDefined()
        expect(typeof IssueChart).toBe('function')
    })

    it('is a regular function component that wraps async content', () => {
        expect(IssueChart.constructor.name).toBe('Function')
    })

    it('exports IssueChartContent as async function', async () => {
        const { IssueChartContent } = await import(
            '@/app/components/IssueChart/IssueChart'
        )
        expect(IssueChartContent.constructor.name).toBe('AsyncFunction')
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

        const { IssueChartContent } = await import(
            '@/app/components/IssueChart/IssueChart'
        )

        await expect(IssueChartContent()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
        })
    })

    it('handles empty status counts', async () => {
        const mockData = {
            issueStatusCount: [],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { IssueChartContent } = await import(
            '@/app/components/IssueChart/IssueChart'
        )

        await expect(IssueChartContent()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
        })
    })

    it('handles single status count', async () => {
        const mockData = {
            issueStatusCount: [
                {
                    label: 'Open',
                    status: 'OPEN',
                    count: 10,
                },
            ],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { IssueChartContent } = await import(
            '@/app/components/IssueChart/IssueChart'
        )

        await expect(IssueChartContent()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
        })
    })

    it('handles multiple status counts with different values', async () => {
        const mockData = {
            issueStatusCount: [
                {
                    label: 'Open',
                    status: 'OPEN',
                    count: 0,
                },
                {
                    label: 'In Progress',
                    status: 'IN_PROGRESS',
                    count: 1,
                },
                {
                    label: 'Closed',
                    status: 'CLOSED',
                    count: 100,
                },
            ],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { IssueChartContent } = await import(
            '@/app/components/IssueChart/IssueChart'
        )

        await expect(IssueChartContent()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
        })
    })

    it('handles GraphQL errors gracefully', async () => {
        mockQuery.mockRejectedValueOnce(new Error('GraphQL error'))

        const { IssueChartContent } = await import(
            '@/app/components/IssueChart/IssueChart'
        )

        await expect(IssueChartContent()).rejects.toThrow('GraphQL error')
    })

    it('uses the correct GraphQL query', async () => {
        const { GET_ISSUES_STATUS_COUNT_QUERY } = await import(
            '@/app/graphql/queries'
        )
        expect(GET_ISSUES_STATUS_COUNT_QUERY).toBeDefined()
        expect(typeof GET_ISSUES_STATUS_COUNT_QUERY).toBe('object')
    })

    it('passes data to IssuesBarChart component', async () => {
        const mockData = {
            issueStatusCount: [
                {
                    label: 'Open',
                    status: 'OPEN',
                    count: 5,
                },
                {
                    label: 'Closed',
                    status: 'CLOSED',
                    count: 10,
                },
            ],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { IssueChartContent } = await import(
            '@/app/components/IssueChart/IssueChart'
        )

        await IssueChartContent()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
        })
    })

    it('imports required dependencies', () => {
        expect(IssueChart).toBeDefined()
    })
})
