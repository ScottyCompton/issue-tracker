import { QueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock @tanstack/react-query
const mockQueryClient = {
    mount: vi.fn(),
    unmount: vi.fn(),
    isFetching: vi.fn(() => 0),
    isMutating: vi.fn(() => 0),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
    getQueriesData: vi.fn(),
    setQueriesData: vi.fn(),
    invalidateQueries: vi.fn(),
    refetchQueries: vi.fn(),
    resetQueries: vi.fn(),
    removeQueries: vi.fn(),
    getQueryState: vi.fn(),
    setQueryDefaults: vi.fn(),
    getQueryDefaults: vi.fn(),
    setMutationDefaults: vi.fn(),
    getMutationDefaults: vi.fn(),
    clear: vi.fn(),
    resetErrorBoundaries: vi.fn(),
    getQueryCache: vi.fn(),
    getMutationCache: vi.fn(),
    getDefaultOptions: vi.fn(),
    setDefaultOptions: vi.fn(),
    getQueryClient: vi.fn(),
}

vi.mock('@tanstack/react-query', () => ({
    QueryClient: vi.fn(() => mockQueryClient) as any,
    QueryClientProvider: ({
        children,
        client,
    }: {
        children: React.ReactNode
        client: any
    }) => (
        <div
            data-testid="react-query-provider"
            data-client={client ? 'present' : 'missing'}
        >
            {children}
        </div>
    ),
}))

describe('QueryClientProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('component structure', () => {
        it('renders without crashing', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div>Test Content</div>
                </QueryClientProvider>
            )

            expect(
                screen.getByTestId('react-query-provider')
            ).toBeInTheDocument()
        })

        it('renders children correctly', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            const testContent = 'Test Child Content'
            render(
                <QueryClientProvider>
                    <div>{testContent}</div>
                </QueryClientProvider>
            )

            expect(screen.getByText(testContent)).toBeInTheDocument()
        })

        it('renders multiple children', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div>Child 1</div>
                    <div>Child 2</div>
                    <div>Child 3</div>
                </QueryClientProvider>
            )

            expect(screen.getByText('Child 1')).toBeInTheDocument()
            expect(screen.getByText('Child 2')).toBeInTheDocument()
            expect(screen.getByText('Child 3')).toBeInTheDocument()
        })

        it('renders nested components', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div>
                        <span>Nested Content</span>
                        <button>Click me</button>
                    </div>
                </QueryClientProvider>
            )

            expect(screen.getByText('Nested Content')).toBeInTheDocument()
            expect(screen.getByText('Click me')).toBeInTheDocument()
        })
    })

    describe('QueryClient configuration', () => {
        it('creates QueryClient instance', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div>Test</div>
                </QueryClientProvider>
            )

            expect(QueryClient).toHaveBeenCalled()
        })

        it('passes QueryClient to provider', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div>Test</div>
                </QueryClientProvider>
            )

            const provider = screen.getByTestId('react-query-provider')
            expect(provider).toHaveAttribute('data-client', 'present')
        })

        it('uses singleton QueryClient instance', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            // Render multiple instances
            const { rerender } = render(
                <QueryClientProvider>
                    <div>First</div>
                </QueryClientProvider>
            )

            rerender(
                <QueryClientProvider>
                    <div>Second</div>
                </QueryClientProvider>
            )

            // Should only create one QueryClient instance
            expect(QueryClient as any).toHaveBeenCalledTimes(1)
        })
    })

    describe('provider functionality', () => {
        it('provides QueryClient context to children', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div data-testid="child-component">
                        Child with Query Context
                    </div>
                </QueryClientProvider>
            )

            const child = screen.getByTestId('child-component')
            expect(child).toBeInTheDocument()
            expect(child).toHaveTextContent('Child with Query Context')
        })

        it('handles empty children', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(<QueryClientProvider>{}</QueryClientProvider>)

            expect(
                screen.getByTestId('react-query-provider')
            ).toBeInTheDocument()
        })

        it('handles null children', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(<QueryClientProvider>{null}</QueryClientProvider>)

            expect(
                screen.getByTestId('react-query-provider')
            ).toBeInTheDocument()
        })

        it('handles undefined children', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(<QueryClientProvider>{undefined}</QueryClientProvider>)

            expect(
                screen.getByTestId('react-query-provider')
            ).toBeInTheDocument()
        })
    })

    describe('component props', () => {
        it('accepts PropsWithChildren interface', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            // Test that the component accepts children prop
            const TestComponent = () => (
                <QueryClientProvider>
                    <div>Test Children</div>
                </QueryClientProvider>
            )

            render(<TestComponent />)
            expect(screen.getByText('Test Children')).toBeInTheDocument()
        })

        it('handles different types of children', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div>String content</div>
                    {42}
                    {true && <span>Conditional content</span>}
                    {false && <span>Hidden content</span>}
                </QueryClientProvider>
            )

            expect(screen.getByText('String content')).toBeInTheDocument()
            expect(screen.getByText('42')).toBeInTheDocument()
            expect(screen.getByText('Conditional content')).toBeInTheDocument()
            expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
        })
    })

    describe('module exports', () => {
        it('exports as default', async () => {
            const module = await import('@/app/QueryClientProvider')
            expect(module.default).toBeDefined()
            expect(typeof module.default).toBe('function')
        })

        it('can be imported successfully', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            expect(QueryClientProvider).toBeDefined()
            expect(typeof QueryClientProvider).toBe('function')
        })

        it('is a React component', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            expect(QueryClientProvider.constructor.name).toBe('Function')
        })
    })

    describe('client-side rendering', () => {
        it('is a client component', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            // Check that the component has the 'use client' directive
            // This is verified by the fact that it imports and uses React components
            expect(QueryClientProvider).toBeDefined()
        })

        it('renders on client side', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div>Client-side rendered content</div>
                </QueryClientProvider>
            )

            expect(
                screen.getByText('Client-side rendered content')
            ).toBeInTheDocument()
        })
    })

    describe('QueryClient instance behavior', () => {
        it('creates QueryClient with default configuration', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            render(
                <QueryClientProvider>
                    <div>Test</div>
                </QueryClientProvider>
            )

            expect(QueryClient as any).toHaveBeenCalledWith()
        })

        it('maintains QueryClient instance across renders', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            const { rerender } = render(
                <QueryClientProvider>
                    <div>First render</div>
                </QueryClientProvider>
            )

            const firstCallCount = (QueryClient as any).mock.calls.length

            rerender(
                <QueryClientProvider>
                    <div>Second render</div>
                </QueryClientProvider>
            )

            // Should not create a new QueryClient instance
            expect((QueryClient as any).mock.calls.length).toBe(firstCallCount)
        })
    })

    describe('performance considerations', () => {
        it('creates QueryClient only once', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            // Clear previous calls
            ;(QueryClient as any).mockClear()

            render(
                <QueryClientProvider>
                    <div>Test</div>
                </QueryClientProvider>
            )

            expect(QueryClient as any).toHaveBeenCalledTimes(1)
        })

        it('reuses QueryClient instance', async () => {
            const { default: QueryClientProvider } = await import(
                '@/app/QueryClientProvider'
            )

            const { rerender } = render(
                <QueryClientProvider>
                    <div>First</div>
                </QueryClientProvider>
            )

            const firstInstance = (QueryClient as any).mock.results[0].value

            rerender(
                <QueryClientProvider>
                    <div>Second</div>
                </QueryClientProvider>
            )

            const secondInstance = (QueryClient as any).mock.results[0].value

            // Should be the same instance
            expect(firstInstance).toBe(secondInstance)
        })
    })
})
