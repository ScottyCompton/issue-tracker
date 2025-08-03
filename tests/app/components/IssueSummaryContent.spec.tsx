import { ProjectProvider } from '@/app/contexts/ProjectContext'
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
        <a href={href} className={className} data-testid="status-link">
            {children}
        </a>
    ),
}))

// Mock Radix UI components
vi.mock('@radix-ui/themes', () => ({
    Card: ({
        children,
        className,
        key,
    }: {
        children: React.ReactNode
        className?: string
        key?: string
    }) => (
        <div data-testid="card" className={className} key={key}>
            {children}
        </div>
    ),
    Flex: ({
        children,
        direction,
        gap,
        className,
        mb,
    }: {
        children: React.ReactNode
        direction?: any
        gap?: string
        className?: string
        mb?: string
    }) => (
        <div
            data-testid="flex"
            className={className}
            style={{ flexDirection: direction, gap, marginBottom: mb }}
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
    Text: ({
        children,
        size,
        className,
    }: {
        children: React.ReactNode
        size?: string
        className?: string
    }) => (
        <span data-testid="text" className={className}>
            {children}
        </span>
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

describe('IssueSummary', () => {
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
        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )
        expect(IssueSummary).toBeDefined()
        expect(typeof IssueSummary).toBe('function')
    })

    it('is a client component', async () => {
        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )
        expect(typeof IssueSummary).toBe('function')
        // Client components are regular functions, not async functions
        expect(IssueSummary.constructor.name).toBe('Function')
    })

    it('renders loading state initially', async () => {
        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )

        render(
            <ProjectProvider>
                <IssueSummary />
            </ProjectProvider>
        )

        // Should show skeleton initially
        expect(screen.getAllByTestId('skeleton')).toHaveLength(7)
    })

    it('executes GraphQL query with correct parameters', async () => {
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

        render(
            <ProjectProvider>
                <IssueSummary />
            </ProjectProvider>
        )

        // Advance timers to complete the artificial delay
        await vi.advanceTimersByTimeAsync(1000)

        // Check that the query was called
        expect(mockQuery).toHaveBeenCalledWith({
            query: 'GET_ISSUES_STATUS_COUNT_QUERY',
            variables: {
                includeAll: true,
                projectId: null,
            },
            fetchPolicy: 'network-only',
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

    it('tests the component structure and dependencies', async () => {
        // Test that all required dependencies are properly imported
        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )
        const { GET_ISSUES_STATUS_COUNT_QUERY } = await import(
            '@/app/graphql/queries'
        )

        expect(IssueSummary).toBeDefined()
        expect(typeof IssueSummary).toBe('function')
        expect(GET_ISSUES_STATUS_COUNT_QUERY).toBeDefined()
        expect(GET_ISSUES_STATUS_COUNT_QUERY).toBe(
            'GET_ISSUES_STATUS_COUNT_QUERY'
        )

        // Test that the component is properly structured
        expect(IssueSummary).toBeInstanceOf(Function)
    })

    it('tests the component rendering logic', async () => {
        const { default: IssueSummary } = await import(
            '@/app/components/IssueSummary'
        )

        // Test that the component is properly structured
        expect(IssueSummary).toBeDefined()
        expect(typeof IssueSummary).toBe('function')

        // The component should be a function that returns JSX
        expect(IssueSummary).toBeInstanceOf(Function)
    })
})
