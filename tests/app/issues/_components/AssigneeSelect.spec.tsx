import { Theme } from '@radix-ui/themes'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Apollo Client
const mockUseQuery = vi.fn()
const mockUseMutation = vi.fn()
vi.mock('@apollo/client', () => ({
    useQuery: mockUseQuery,
    useMutation: mockUseMutation,
}))

// Mock the GraphQL queries
vi.mock('@/app/graphql/queries', () => ({
    GET_USERS_QUERY: { query: 'GET_USERS_QUERY' },
    UPDATE_ISSUE_ASSIGNEE_MUTATION: {
        mutation: 'UPDATE_ISSUE_ASSIGNEE_MUTATION',
    },
}))

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
    return render(<Theme>{ui}</Theme>)
}

describe('AssigneeSelect', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseQuery.mockReturnValue({
            data: {
                users: [
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
            },
            error: null,
            loading: false,
        })
        mockUseMutation.mockReturnValue([
            vi.fn().mockResolvedValue({
                data: {
                    updateIssueAssignee: {
                        id: 'issue1',
                        assignedToUserId: 'user1',
                    },
                },
            }),
        ])
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
            loading: true,
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
            loading: false,
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
        const mockMutate = vi.fn().mockResolvedValue({
            data: {
                updateIssueAssignee: {
                    id: 'issue1',
                    assignedToUserId: 'user1',
                },
            },
        })
        mockUseMutation.mockReturnValue([mockMutate])

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
        const mockMutate = vi.fn().mockResolvedValue({
            data: {
                updateIssueAssignee: { id: 'issue1', assignedToUserId: null },
            },
        })
        mockUseMutation.mockReturnValue([mockMutate])

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
        const mockMutate = vi
            .fn()
            .mockRejectedValue(new Error('Assignment failed'))
        mockUseMutation.mockReturnValue([mockMutate])

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
        const mockMutate = vi.fn().mockResolvedValue({
            data: {
                updateIssueAssignee: {
                    id: 'issue1',
                    assignedToUserId: 'user1',
                },
            },
        })
        mockUseMutation.mockReturnValue([mockMutate])

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

    it('calls Apollo Client with correct parameters', async () => {
        const { default: AssigneeSelect } = await import(
            '@/app/issues/_components/AssigneeSelect'
        )

        customRender(<AssigneeSelect issueId="issue1" />)

        expect(mockUseQuery).toHaveBeenCalledWith({ query: 'GET_USERS_QUERY' })
        expect(mockUseMutation).toHaveBeenCalledWith({
            mutation: 'UPDATE_ISSUE_ASSIGNEE_MUTATION',
        })
    })

    it('handles empty users list', async () => {
        mockUseQuery.mockReturnValue({
            data: { users: [] },
            error: null,
            loading: false,
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
