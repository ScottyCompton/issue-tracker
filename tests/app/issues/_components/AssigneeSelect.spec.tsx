import { Theme } from '@radix-ui/themes'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the GraphQL client
const mockQuery = vi.fn()
const mockMutate = vi.fn()
vi.mock('@/app/lib/graphql-client', () => ({
    client: {
        query: mockQuery,
        mutate: mockMutate,
    },
}))

// Mock the GraphQL queries
vi.mock('@/app/graphql/queries', () => ({
    GET_USERS_QUERY: { query: 'GET_USERS_QUERY' },
    UPDATE_ISSUE_ASSIGNEE_MUTATION: {
        mutation: 'UPDATE_ISSUE_ASSIGNEE_MUTATION',
    },
}))

// Mock React Query
const mockUseQuery = vi.fn()
vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual<
        typeof import('@tanstack/react-query')
    >('@tanstack/react-query')
    return {
        ...actual,
        useQuery: mockUseQuery,
    }
})

// Mock react-hot-toast
const mockToast = {
    dismiss: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
}
vi.mock('react-hot-toast', () => ({
    default: mockToast,
    Toaster: () => <div data-testid="toaster" />,
}))

// Mock the Skeleton component
vi.mock('@/app/components', () => ({
    Skeleton: () => <div data-testid="skeleton" />,
}))

// Custom render function with providers
const customRender = (ui: React.ReactElement) => {
    // Import here, after mocks are set up
    const {
        QueryClient,
        QueryClientProvider,
    } = require('@tanstack/react-query')
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return render(
        <QueryClientProvider client={queryClient}>
            <Theme>{ui}</Theme>
        </QueryClientProvider>
    )
}

describe('AssigneeSelect', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseQuery.mockReturnValue({
            data: [
                {
                    id: 'user1',
                    name: 'John Doe',
                    email: 'john@example.com',
                },
                {
                    id: 'user2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                },
            ],
            error: null,
            isLoading: false,
        })
    })

    it('renders with users data', async () => {
        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(
            <AssigneeSelect issueId="issue1" assignedToUserId="user1" />
        )

        // Check that the select is rendered and shows the selected user
        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toHaveTextContent('John Doe')
        // Do not check for other options unless dropdown is open
    })

    it('renders loading state', async () => {
        mockUseQuery.mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        })

        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    })

    it('renders nothing when there is an error', async () => {
        mockUseQuery.mockReturnValue({
            data: null,
            error: new Error('Failed to fetch users'),
            isLoading: false,
        })

        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        // The select should not be rendered
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
        // Optionally, check that no user options are present
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })

    it('handles user assignment successfully', async () => {
        mockMutate.mockResolvedValueOnce({
            data: {
                updateIssueAssignee: {
                    id: 'issue1',
                    assignedToUserId: 'user1',
                },
            },
        })

        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        const userOption = screen.getByText('John Doe')
        fireEvent.click(userOption)

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                mutation: { mutation: 'UPDATE_ISSUE_ASSIGNEE_MUTATION' },
                variables: {
                    id: 'issue1',
                    input: {
                        assignedToUserId: 'user1',
                    },
                },
            })
        })

        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalledWith(
                'Changes saved successfully.'
            )
        })
    })

    it('handles unassignment successfully', async () => {
        mockMutate.mockResolvedValueOnce({
            data: {
                updateIssueAssignee: { id: 'issue1', assignedToUserId: null },
            },
        })

        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(
            <AssigneeSelect issueId="issue1" assignedToUserId="user1" />
        )

        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        const unassignedOption = screen.getByText('Unassigned')
        fireEvent.click(unassignedOption)

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                mutation: { mutation: 'UPDATE_ISSUE_ASSIGNEE_MUTATION' },
                variables: {
                    id: 'issue1',
                    input: {
                        assignedToUserId: null,
                    },
                },
            })
        })

        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalledWith(
                'Changes saved successfully.'
            )
        })
    })

    it('handles assignment error', async () => {
        mockMutate.mockRejectedValueOnce(new Error('Assignment failed'))

        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        const userOption = screen.getByText('John Doe')
        fireEvent.click(userOption)

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                mutation: { mutation: 'UPDATE_ISSUE_ASSIGNEE_MUTATION' },
                variables: {
                    id: 'issue1',
                    input: {
                        assignedToUserId: 'user1',
                    },
                },
            })
        })

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'Changes could not be saved'
            )
        })
    })

    it('dismisses toast before making new assignment', async () => {
        mockMutate.mockResolvedValueOnce({
            data: {
                updateIssueAssignee: {
                    id: 'issue1',
                    assignedToUserId: 'user1',
                },
            },
        })

        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        const select = screen.getByRole('combobox')
        fireEvent.click(select)

        const userOption = screen.getByText('John Doe')
        fireEvent.click(userOption)

        await waitFor(() => {
            expect(mockToast.dismiss).toHaveBeenCalled()
        })
    })

    it('sets correct default value when assigned', async () => {
        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(
            <AssigneeSelect issueId="issue1" assignedToUserId="user1" />
        )

        const select = screen.getByRole('combobox')
        expect(select).toHaveTextContent('John Doe')
    })

    it('sets correct default value when unassigned', async () => {
        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        const select = screen.getByRole('combobox')
        // Should show placeholder or 'Unassigned' if that's the default
        expect(select).toHaveTextContent(/assign|unassigned/i)
    })

    it('renders toaster component', async () => {
        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        expect(screen.getByTestId('toaster')).toBeInTheDocument()
    })

    it('calls React Query with correct parameters', async () => {
        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        expect(mockUseQuery).toHaveBeenCalledWith({
            queryKey: ['users'],
            queryFn: expect.any(Function),
            staleTime: 3600 * 1000,
            retry: 3,
        })
    })

    it('handles empty users list', async () => {
        mockUseQuery.mockReturnValue({
            data: [],
            error: null,
            isLoading: false,
        })

        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByText('Unassigned')).toBeInTheDocument()
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })
})
