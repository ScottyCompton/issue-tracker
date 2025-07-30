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

// Mock next/link
vi.mock('next/link', () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode
        href: string
    }) => (
        <a href={href} data-testid="status-link">
            {children}
        </a>
    ),
}))

describe('IssueSummary', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('can be imported successfully', async () => {
        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )
        expect(IssueSummary).toBeDefined()
        expect(typeof IssueSummary).toBe('function')
    })

    it('is an async function component', async () => {
        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )
        expect(IssueSummary.constructor.name).toBe('AsyncFunction')
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

        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )

        await expect(IssueSummary()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
            variables: {
                includeAll: true,
            },
        })
    })

    it('handles empty status counts', async () => {
        const mockData = {
            issueStatusCount: [],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )

        await expect(IssueSummary()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
            variables: {
                includeAll: true,
            },
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

        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )

        await expect(IssueSummary()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
            variables: {
                includeAll: true,
            },
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

        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )

        await expect(IssueSummary()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
            variables: {
                includeAll: true,
            },
        })
    })

    it('handles GraphQL errors gracefully', async () => {
        mockQuery.mockRejectedValueOnce(new Error('GraphQL error'))

        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )

        await expect(IssueSummary()).rejects.toThrow('GraphQL error')
    })

    it('uses the correct GraphQL query', async () => {
        const { GET_ISSUES_STATUS_COUNT_QUERY } = await import(
            '@/app/graphql/queries'
        )
        expect(GET_ISSUES_STATUS_COUNT_QUERY).toBeDefined()
        expect(GET_ISSUES_STATUS_COUNT_QUERY.query).toBe(
            'GET_ISSUES_STATUS_COUNT_QUERY'
        )
    })

    it('passes correct variables to GraphQL query', async () => {
        const mockData = {
            issueStatusCount: [
                {
                    label: 'Open',
                    status: 'OPEN',
                    count: 5,
                },
            ],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )

        await IssueSummary()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_ISSUES_STATUS_COUNT_QUERY' },
            variables: {
                includeAll: true,
            },
        })
    })

    it('imports required dependencies', async () => {
        const componentModule = await import('@/app/components/IssueSummary')
        expect(componentModule.default).toBeDefined()
    })
})
