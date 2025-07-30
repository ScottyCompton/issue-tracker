import { Theme } from '@radix-ui/themes'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the GraphQL client
const mockMutate = vi.fn()
vi.mock('@/app/lib/graphql-client', () => ({
    client: {
        mutate: mockMutate,
    },
}))

// Mock the GraphQL mutation
vi.mock('@/app/graphql/queries', () => ({
    DELETE_ISSUE_MUTATION: { mutation: 'DELETE_ISSUE_MUTATION' },
}))

// Mock next/navigation
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: mockRefresh,
    }),
}))

// Mock the Spinner component
vi.mock('@/app/components', () => ({
    Spinner: () => <div data-testid="spinner" />,
}))

// Mock react-icons
vi.mock('react-icons/bs', () => ({
    BsExclamationTriangle: () => <div data-testid="exclamation-icon" />,
}))

// Custom render function with Theme provider
const customRender = (ui: React.ReactElement) => {
    return render(<Theme>{ui}</Theme>)
}

describe('DeleteIssueButton', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders delete button correctly', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        expect(screen.getByText('Delete Issue')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders with correct issue ID', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="456" />)

        expect(screen.getByText('Delete Issue')).toBeInTheDocument()
    })

    it('opens confirmation dialog when delete button is clicked', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // There should be a dialog title and a confirm button with the same text
        const dialogTitle = screen
            .getAllByText('Delete Issue')
            .find((el) => el.tagName === 'H1')
        const confirmButton = screen
            .getAllByRole('button')
            .find(
                (button) =>
                    button.textContent === 'Delete Issue' &&
                    !button.hasAttribute('aria-haspopup')
            )
        expect(dialogTitle).toBeInTheDocument()
        expect(confirmButton).toBeInTheDocument()
        expect(
            screen.getByText('Are you sure? This action cannot be undone.')
        ).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('handles successful deletion', async () => {
        mockMutate.mockResolvedValueOnce({
            data: { deleteIssue: { id: '123' } },
        })

        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // Click confirm delete - get the button inside the dialog (not the trigger)
        const buttons = screen.getAllByRole('button')
        const confirmDeleteButton = buttons.find(
            (button) =>
                button.textContent === 'Delete Issue' &&
                !button.hasAttribute('aria-haspopup')
        )
        fireEvent.click(confirmDeleteButton!)

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                mutation: { mutation: 'DELETE_ISSUE_MUTATION' },
                variables: { id: '123' },
            })
        })

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/issues/list')
            expect(mockRefresh).toHaveBeenCalled()
        })
    })

    it('handles API errors gracefully', async () => {
        mockMutate.mockRejectedValueOnce(new Error('API Error'))

        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // Click confirm delete - get the button inside the dialog (not the trigger)
        const buttons = screen.getAllByRole('button')
        const confirmDeleteButton = buttons.find(
            (button) =>
                button.textContent === 'Delete Issue' &&
                !button.hasAttribute('aria-haspopup')
        )
        fireEvent.click(confirmDeleteButton!)

        await waitFor(() => {
            expect(
                screen.getByText('An unexpected error occurred.')
            ).toBeInTheDocument()
        })
    })

    it('shows loading state during deletion', async () => {
        mockMutate.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100))
        )

        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // Click confirm delete - get the button inside the dialog (not the trigger)
        const buttons = screen.getAllByRole('button')
        const confirmDeleteButton = buttons.find(
            (button) =>
                button.textContent === 'Delete Issue' &&
                !button.hasAttribute('aria-haspopup')
        )
        fireEvent.click(confirmDeleteButton!)

        await waitFor(() => {
            expect(screen.getByTestId('spinner')).toBeInTheDocument()
        })
    })

    it('disables delete button during loading', async () => {
        mockMutate.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100))
        )

        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // Click confirm delete - get the button inside the dialog (not the trigger)
        const buttons = screen.getAllByRole('button')
        const confirmDeleteButton = buttons.find(
            (button) =>
                button.textContent === 'Delete Issue' &&
                !button.hasAttribute('aria-haspopup')
        )
        fireEvent.click(confirmDeleteButton!)

        await waitFor(() => {
            const mainDeleteButton = screen.getByText('Delete Issue')
            expect(mainDeleteButton).toBeDisabled()
        })
    })

    it('handles cancel button click', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // Click cancel
        const cancelButton = screen.getByText('Cancel')
        fireEvent.click(cancelButton)

        // Dialog should be closed
        expect(
            screen.queryByText('Are you sure? This action cannot be undone.')
        ).not.toBeInTheDocument()
    })

    it('calls GraphQL mutation with correct parameters', async () => {
        mockMutate.mockResolvedValueOnce({
            data: { deleteIssue: { id: '123' } },
        })

        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="789" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // Click confirm delete - get the button inside the dialog (not the trigger)
        const buttons = screen.getAllByRole('button')
        const confirmDeleteButton = buttons.find(
            (button) =>
                button.textContent === 'Delete Issue' &&
                !button.hasAttribute('aria-haspopup')
        )
        fireEvent.click(confirmDeleteButton!)

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                mutation: { mutation: 'DELETE_ISSUE_MUTATION' },
                variables: { id: '789' },
            })
        })
    })

    it('renders error callout when API error exists', async () => {
        mockMutate.mockRejectedValueOnce(new Error('API Error'))

        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // Click confirm delete - get the button inside the dialog (not the trigger)
        const buttons = screen.getAllByRole('button')
        const confirmDeleteButton = buttons.find(
            (button) =>
                button.textContent === 'Delete Issue' &&
                !button.hasAttribute('aria-haspopup')
        )
        fireEvent.click(confirmDeleteButton!)

        await waitFor(() => {
            expect(screen.getByTestId('exclamation-icon')).toBeInTheDocument()
            expect(
                screen.getByText('An unexpected error occurred.')
            ).toBeInTheDocument()
        })
    })

    it('handles different issue IDs', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="different-id" />)

        expect(screen.getByText('Delete Issue')).toBeInTheDocument()
    })

    it('is a client-side component', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        expect(typeof DeleteIssueButton).toBe('function')
    })

    it('can be imported successfully', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        expect(DeleteIssueButton).toBeDefined()
    })

    it('renders with empty issue ID', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="" />)

        expect(screen.getByText('Delete Issue')).toBeInTheDocument()
    })

    it('renders with numeric issue ID', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        expect(screen.getByText('Delete Issue')).toBeInTheDocument()
    })

    it('handles multiple rapid clicks gracefully', async () => {
        mockMutate.mockResolvedValueOnce({
            data: { deleteIssue: { id: '123' } },
        })

        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // Click confirm delete multiple times - get the button inside the dialog (not the trigger)
        const buttons = screen.getAllByRole('button')
        const confirmDeleteButton = buttons.find(
            (button) =>
                button.textContent === 'Delete Issue' &&
                !button.hasAttribute('aria-haspopup')
        )
        fireEvent.click(confirmDeleteButton!)
        fireEvent.click(confirmDeleteButton!)

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledTimes(1) // Should only be called once
        })
    })

    it('resets error state on new deletion attempt', async () => {
        // First attempt fails
        mockMutate.mockRejectedValueOnce(new Error('API Error'))

        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        const { rerender } = customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog and trigger error
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)
        // Click confirm delete - get the button inside the dialog (not the trigger)
        const buttons = screen.getAllByRole('button')
        const confirmDeleteButton = buttons.find(
            (button) =>
                button.textContent === 'Delete Issue' &&
                !button.hasAttribute('aria-haspopup')
        )
        fireEvent.click(confirmDeleteButton!)

        await waitFor(() => {
            expect(
                screen.getByText('An unexpected error occurred.')
            ).toBeInTheDocument()
        })

        // Second attempt succeeds
        mockMutate.mockResolvedValueOnce({
            data: { deleteIssue: { id: '123' } },
        })

        // Rerender to simulate new component instance
        rerender(<DeleteIssueButton issueId="123" />)

        // Error should be cleared
        expect(
            screen.queryByText('An unexpected error occurred.')
        ).not.toBeInTheDocument()
    })

    it('renders with correct button styling', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        const deleteButton = screen.getByText('Delete Issue')
        expect(deleteButton).toHaveClass('rt-Button')
    })

    it('renders confirmation dialog with correct structure', async () => {
        const { default: DeleteIssueButton } = await import(
            '@/app/issues/_components/DeleteIssueButton'
        )

        customRender(<DeleteIssueButton issueId="123" />)

        // Open dialog
        const deleteButton = screen.getByText('Delete Issue')
        fireEvent.click(deleteButton)

        // There should be a dialog title and a confirm button with the same text
        const dialogTitle = screen
            .getAllByText('Delete Issue')
            .find((el) => el.tagName === 'H1')
        const confirmButton = screen
            .getAllByRole('button')
            .find(
                (button) =>
                    button.textContent === 'Delete Issue' &&
                    !button.hasAttribute('aria-haspopup')
            )
        expect(dialogTitle).toBeInTheDocument()
        expect(confirmButton).toBeInTheDocument()
        expect(
            screen.getByText('Are you sure? This action cannot be undone.')
        ).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
})
