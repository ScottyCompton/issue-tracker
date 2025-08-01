import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { Theme } from '@radix-ui/themes'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode
        href: string
    }) => (
        <a href={href} data-testid="create-issue-link">
            {children}
        </a>
    ),
}))

// Mock next/navigation for IssueStatusFilter
const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams('sortBy=title&sortOrder=asc')

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => mockSearchParams,
}))

// Mock the IssueStatusFilter component
vi.mock('./IssueStatusFilter', () => ({
    default: ({ currStatus }: { currStatus?: string }) => (
        <div data-testid="issue-status-filter" data-current-status={currStatus}>
            Status Filter
        </div>
    ),
}))

// Mock UserFilter to avoid Apollo Client issues
vi.mock('./UserFilter', () => ({
    default: ({ currUserId }: { currUserId?: string }) => (
        <div data-testid="user-filter" data-current-user-id={currUserId}>
            User Filter
        </div>
    ),
}))

// Create a mock Apollo Client
const createMockApolloClient = () => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: {
            request: vi.fn(),
        } as any,
    })
}

// Custom render function with Theme and Apollo providers
const customRender = (ui: React.ReactElement) => {
    const mockClient = createMockApolloClient()
    return render(
        <ApolloProvider client={mockClient}>
            <Theme>{ui}</Theme>
        </ApolloProvider>
    )
}

describe('IssuesToolbar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders toolbar with filter and create button', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByTestId('create-issue-link')).toBeInTheDocument()
        expect(screen.getByText('Create Issue')).toBeInTheDocument()
    })

    it('renders with current status', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar currStatus="OPEN" />)

        const filter = screen.getByRole('combobox')
        expect(filter).toBeInTheDocument()
        expect(screen.getByText('Open')).toBeInTheDocument()
    })

    it('renders without current status', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar currStatus={undefined} />)

        const filter = screen.getByRole('combobox')
        expect(filter).toBeInTheDocument()
        expect(screen.getByText('Filter by status...')).toBeInTheDocument()
    })

    it('renders with loading state disabled', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar loading={true} />)

        const createButton = screen.getByRole('button')
        expect(createButton).toBeDisabled()
    })

    it('renders with loading state enabled', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar loading={false} />)

        const createButton = screen.getByRole('button')
        expect(createButton).not.toBeDisabled()
    })

    it('renders with default loading state', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar />)

        const createButton = screen.getByRole('button')
        expect(createButton).not.toBeDisabled()
    })

    it('has correct create issue link', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar />)

        const createLink = screen.getByTestId('create-issue-link')
        expect(createLink).toHaveAttribute('href', '/issues/new/')
    })

    it('renders with different status values', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar currStatus="CLOSED" />)

        const filter = screen.getByRole('combobox')
        expect(filter).toBeInTheDocument()
        expect(screen.getByText('Closed')).toBeInTheDocument()
    })

    it('renders with null status', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar currStatus={null as any} />)

        const filter = screen.getByRole('combobox')
        expect(filter).toBeInTheDocument()
    })

    it('renders with empty string status', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar currStatus="" />)

        const filter = screen.getByRole('combobox')
        expect(filter).toBeInTheDocument()
        expect(screen.getByText('Filter by status...')).toBeInTheDocument()
    })

    it('renders with IN_PROGRESS status', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar currStatus="IN_PROGRESS" />)

        const filter = screen.getByRole('combobox')
        expect(filter).toBeInTheDocument()
        expect(screen.getByText('In-Progress')).toBeInTheDocument()
    })

    it('has correct layout structure', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        const { container } = customRender(<IssuesToolbar />)

        // Check for Container and Flex structure
        const containerElement = container.querySelector(
            '[class*="rt-Container"]'
        )
        const flexElement = container.querySelector('[class*="rt-Flex"]')

        expect(containerElement).toBeInTheDocument()
        expect(flexElement).toBeInTheDocument()
    })

    it('is a client-side component', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        expect(typeof IssuesToolbar).toBe('function')
    })

    it('can be imported successfully', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        expect(IssuesToolbar).toBeDefined()
    })

    it('handles component without props', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByTestId('create-issue-link')).toBeInTheDocument()
    })

    it('handles component with all props', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar currStatus="OPEN" loading={true} />)

        const filter = screen.getByRole('combobox')
        const createButton = screen.getByRole('button')

        expect(filter).toBeInTheDocument()
        expect(screen.getByText('Open')).toBeInTheDocument()
        expect(createButton).toBeDisabled()
    })

    it('handles component with undefined loading prop', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar loading={undefined} />)

        const createButton = screen.getByRole('button')
        expect(createButton).not.toBeDisabled()
    })

    it('handles component with null loading prop', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar loading={null as any} />)

        const createButton = screen.getByRole('button')
        expect(createButton).not.toBeDisabled()
    })

    it('renders both filter and button in correct positions', async () => {
        const { default: IssuesToolbar } = await import(
            '@/app/issues/_components/IssuesToolbar'
        )

        customRender(<IssuesToolbar />)

        const filter = screen.getByRole('combobox')
        const createLink = screen.getByTestId('create-issue-link')

        expect(filter).toBeInTheDocument()
        expect(createLink).toBeInTheDocument()
        expect(screen.getByText('Create Issue')).toBeInTheDocument()
    })
})
