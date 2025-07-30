import { Status } from '@/app/generated/prisma'
import { UPDATE_ISSUE_MUTATION } from '@/app/graphql/queries'
import { MockedProvider } from '@apollo/client/testing'
import { Theme } from '@radix-ui/themes'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock react-hot-toast
const mockToast = {
    success: vi.fn(),
    error: vi.fn(),
}
vi.mock('react-hot-toast', () => ({
    toast: mockToast,
}))

// Custom render function with Apollo Client provider
const customRender = (ui: React.ReactElement, mocks: any[] = []) => {
    return render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <Theme>{ui}</Theme>
        </MockedProvider>
    )
}

describe('StatusSelect', () => {
    const mockIssueId = '1'
    const mockCurrentStatus: Status = 'OPEN'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders with current status', async () => {
        const { default: StatusSelect } = await import(
            '@/app/issues/_components/StatusSelect'
        )

        customRender(
            <StatusSelect
                issueId={mockIssueId}
                currentStatus={mockCurrentStatus}
            />
        )

        // The Select component should be rendered
        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('displays current status in the select', async () => {
        const { default: StatusSelect } = await import(
            '@/app/issues/_components/StatusSelect'
        )

        customRender(
            <StatusSelect
                issueId={mockIssueId}
                currentStatus={mockCurrentStatus}
            />
        )

        // The select should display the current status
        expect(screen.getByText('Open')).toBeInTheDocument()
    })

    it('calls mutation when status is changed', async () => {
        const { default: StatusSelect } = await import(
            '@/app/issues/_components/StatusSelect'
        )

        const mocks = [
            {
                request: {
                    query: UPDATE_ISSUE_MUTATION,
                    variables: {
                        id: mockIssueId,
                        input: {
                            status: 'IN_PROGRESS',
                        },
                    },
                },
                result: {
                    data: {
                        updateIssue: {
                            id: mockIssueId,
                            title: 'Test Issue',
                            description: 'Test Description',
                            status: 'IN_PROGRESS',
                            createdAt: '2024-01-15T10:30:00Z',
                            updatedAt: '2024-01-15T11:45:00Z',
                        },
                    },
                },
            },
        ]

        customRender(
            <StatusSelect
                issueId={mockIssueId}
                currentStatus={mockCurrentStatus}
            />,
            mocks
        )

        // Click to open the select
        const selectTrigger = screen.getByRole('combobox')
        fireEvent.click(selectTrigger)

        // Wait for the content to appear and select a new status
        await waitFor(() => {
            const option = screen.getByText('In Progress')
            fireEvent.click(option)
        })

        // Wait for the mutation to complete
        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalledWith(
                'Status changed to IN_PROGRESS',
                { id: 'status-change-1' }
            )
        })
    })

    it('calls onStatusChange callback when status is updated', async () => {
        const { default: StatusSelect } = await import(
            '@/app/issues/_components/StatusSelect'
        )

        const onStatusChange = vi.fn()

        const mocks = [
            {
                request: {
                    query: UPDATE_ISSUE_MUTATION,
                    variables: {
                        id: mockIssueId,
                        input: {
                            status: 'CLOSED',
                        },
                    },
                },
                result: {
                    data: {
                        updateIssue: {
                            id: mockIssueId,
                            title: 'Test Issue',
                            description: 'Test Description',
                            status: 'CLOSED',
                            createdAt: '2024-01-15T10:30:00Z',
                            updatedAt: '2024-01-15T11:45:00Z',
                        },
                    },
                },
            },
        ]

        customRender(
            <StatusSelect
                issueId={mockIssueId}
                currentStatus={mockCurrentStatus}
                onStatusChange={onStatusChange}
            />,
            mocks
        )

        // Click to open the select
        const selectTrigger = screen.getByRole('combobox')
        fireEvent.click(selectTrigger)

        // Wait for the content to appear and select a new status
        await waitFor(() => {
            const option = screen.getByText('Closed')
            fireEvent.click(option)
        })

        // Wait for the callback to be called
        await waitFor(() => {
            expect(onStatusChange).toHaveBeenCalledWith('CLOSED')
        })
    })
})
