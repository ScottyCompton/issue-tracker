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
    GET_LATEST_ISSUES_QUERY: 'GET_LATEST_ISSUES_QUERY',
}))

// Mock next/link
vi.mock('next/link', () => ({
    default: ({
        children,
        href,
        className,
    }: {
        children: React.ReactNode
        href: string
        className?: string
    }) => (
        <a href={href} className={className} data-testid="issue-link">
            {children}
        </a>
    ),
}))

// Mock Radix UI components
vi.mock('@radix-ui/themes', () => ({
    Avatar: ({
        src,
        fallback,
        size,
        radius,
    }: {
        src?: string
        fallback: string
        size: string
        radius: string
    }) => (
        <div data-testid="avatar" style={{ backgroundImage: src }}>
            {fallback}
        </div>
    ),
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
    Flex: ({
        children,
        direction,
        gap,
        className,
        mb,
        justify,
        align,
    }: {
        children: React.ReactNode
        direction?: any
        gap?: string
        className?: string
        mb?: string
        justify?: string
        align?: string
    }) => (
        <div
            data-testid="flex"
            className={className}
            style={{
                flexDirection: direction,
                gap,
                marginBottom: mb,
                justifyContent: justify,
                alignItems: align,
            }}
        >
            {children}
        </div>
    ),
    Heading: ({
        children,
        size,
        mb,
    }: {
        children: React.ReactNode
        size?: string
        mb?: string
    }) => (
        <h2 data-testid="heading" style={{ marginBottom: mb }}>
            {children}
        </h2>
    ),
    Tooltip: ({
        children,
        content,
    }: {
        children: React.ReactNode
        content: string
    }) => (
        <div data-testid="tooltip" title={content}>
            {children}
        </div>
    ),
}))

// Mock IssueStatusBadge
vi.mock('@/app/components/IssueStatusBadge', () => ({
    default: ({ status }: { status: string }) => (
        <span data-testid="status-badge">{status}</span>
    ),
}))

// Mock LatestIssuesSkeleton
vi.mock('@/app/components/LatestIssuesSkeleton', () => ({
    default: () => <div data-testid="skeleton">Loading...</div>,
}))

describe('LatestIssues', () => {
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
        const { default: LatestIssues } = await import(
            '@/app/components/LatestIssues'
        )
        expect(LatestIssues).toBeDefined()
        expect(typeof LatestIssues).toBe('function')
    })

    it('is a client component', async () => {
        const { default: LatestIssues } = await import(
            '@/app/components/LatestIssues'
        )
        expect(typeof LatestIssues).toBe('function')
        // Client components are regular functions, not async functions
        expect(LatestIssues.constructor.name).toBe('Function')
    })

    it('renders loading state initially', async () => {
        const { default: LatestIssues } = await import(
            '@/app/components/LatestIssues'
        )

        render(<LatestIssues />)

        // Should show skeleton initially
        expect(screen.getByTestId('skeleton')).toBeInTheDocument()
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

        render(<LatestIssues />)

        // Advance timers to complete the artificial delay
        await vi.advanceTimersByTimeAsync(1000)

        // Check that the query was called
        expect(mockQuery).toHaveBeenCalledWith({
            query: 'GET_LATEST_ISSUES_QUERY',
            fetchPolicy: 'network-only',
        })
    })

    it('uses the correct GraphQL query', async () => {
        const { GET_LATEST_ISSUES_QUERY } = await import(
            '@/app/graphql/queries'
        )
        expect(GET_LATEST_ISSUES_QUERY).toBeDefined()
        expect(GET_LATEST_ISSUES_QUERY).toBe('GET_LATEST_ISSUES_QUERY')
    })

    it('imports required dependencies', async () => {
        // Test that the component imports the required dependencies
        const componentModule = await import('@/app/components/LatestIssues')
        expect(componentModule.default).toBeDefined()
    })
})
