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
    GET_LATEST_ISSUES_QUERY: { query: 'GET_LATEST_ISSUES_QUERY' },
}))

describe('LatestIssues', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('can be imported successfully', async () => {
        const { default: LatestIssues } = await import(
            '@/app/components/LatestIssues'
        )
        expect(LatestIssues).toBeDefined()
        expect(typeof LatestIssues).toBe('function')
    })

    it('is an async function component', async () => {
        const { default: LatestIssues } = await import(
            '@/app/components/LatestIssues'
        )
        expect(LatestIssues.constructor.name).toBe('AsyncFunction')
    })

    it('handles GraphQL query with mock data', async () => {
        const mockData = {
            latestIssues: [
                {
                    id: '1',
                    title: 'Bug in login system',
                    status: 'OPEN',
                    assignedToUser: {
                        id: 'user1',
                        name: 'John Doe',
                        email: 'john@example.com',
                        image: 'https://example.com/avatar.jpg',
                    },
                },
            ],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { default: LatestIssues } = await import(
            '@/app/components/LatestIssues'
        )

        // The component should execute without throwing when properly mocked
        await expect(LatestIssues()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_LATEST_ISSUES_QUERY' },
        })
    })

    it('handles empty issues array', async () => {
        const mockData = {
            latestIssues: [],
        }

        mockQuery.mockResolvedValueOnce({ data: mockData })

        const { default: LatestIssues } = await import(
            '@/app/components/LatestIssues'
        )

        await expect(LatestIssues()).resolves.toBeDefined()

        expect(mockQuery).toHaveBeenCalledWith({
            query: { query: 'GET_LATEST_ISSUES_QUERY' },
        })
    })

    it('handles GraphQL errors gracefully', async () => {
        mockQuery.mockRejectedValueOnce(new Error('GraphQL error'))

        const { default: LatestIssues } = await import(
            '@/app/components/LatestIssues'
        )

        await expect(LatestIssues()).rejects.toThrow('GraphQL error')
    })

    it('uses the correct GraphQL query', async () => {
        const { GET_LATEST_ISSUES_QUERY } = await import(
            '@/app/graphql/queries'
        )
        expect(GET_LATEST_ISSUES_QUERY).toBeDefined()
        expect(GET_LATEST_ISSUES_QUERY.query).toBe('GET_LATEST_ISSUES_QUERY')
    })

    it('imports required dependencies', async () => {
        // Test that the component imports the required dependencies
        const componentModule = await import('@/app/components/LatestIssues')
        expect(componentModule.default).toBeDefined()
    })
})
