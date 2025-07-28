import { Theme } from '@radix-ui/themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import React, { ReactElement } from 'react'
import { vi } from 'vitest'

// Mock Next.js router
const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
    },
}

// Mock Next.js useRouter
vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js useSession
vi.mock('next-auth/react', async () => {
    const actual = await vi.importActual('next-auth/react')
    return {
        ...actual,
        useSession: () => ({
            data: null,
            status: 'unauthenticated',
        }),
    }
})

// Mock axios
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}))

// Mock Prisma client
vi.mock('@/prisma/client', () => ({
    prisma: {
        issue: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        user: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}))

// Mock data factories
export const createMockIssue = (overrides = {}) => ({
    id: '1',
    title: 'Test Issue',
    description: 'Test description',
    status: 'OPEN' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    assigneeId: null,
    ...overrides,
})

export const createMockUser = (overrides = {}) => ({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
    ...overrides,
})

export const createMockSession = (overrides = {}) => ({
    user: createMockUser(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    ...overrides,
})

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    session?: any
    queryClient?: QueryClient
}

export function customRender(
    ui: ReactElement,
    options: CustomRenderOptions = {}
) {
    const {
        session = null,
        queryClient = new QueryClient(),
        ...renderOptions
    } = options

    const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
        return (
            <SessionProvider session={session}>
                <QueryClientProvider client={queryClient}>
                    <Theme>{children}</Theme>
                </QueryClientProvider>
            </SessionProvider>
        )
    }

    return render(ui, { wrapper: AllTheProviders, ...renderOptions })
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Test helpers
export const waitForLoadingToFinish = () => {
    return new Promise((resolve) => setTimeout(resolve, 0))
}

export const mockApiResponse = (data: any, status = 200) => {
    return Promise.resolve({ data, status })
}

export const mockApiError = (message: string, status = 400) => {
    return Promise.reject({ response: { data: { message }, status } })
}

// Common test utilities
export const getByRoleAndName = (
    container: HTMLElement,
    role: string,
    name: string
) => {
    return container.querySelector(`[role="${role}"][aria-label="${name}"]`)
}

// Note: Use these utilities in test files where Jest DOM matchers are available
export const expectElementToBeVisible = (element: HTMLElement | null) => {
    if (!element) throw new Error('Element is null')
    return element
}

export const expectElementToHaveText = (
    element: HTMLElement | null,
    text: string
) => {
    if (!element) throw new Error('Element is null')
    if (!element.textContent?.includes(text)) {
        throw new Error(`Expected element to contain text "${text}"`)
    }
    return element
}

export const expectElementToHaveAttribute = (
    element: HTMLElement | null,
    attribute: string,
    value: string
) => {
    if (!element) throw new Error('Element is null')
    if (element.getAttribute(attribute) !== value) {
        throw new Error(
            `Expected element to have attribute "${attribute}" with value "${value}"`
        )
    }
    return element
}
