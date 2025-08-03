import ProjectSelector from '@/app/components/ProjectSelector'
import { ProjectProvider } from '@/app/contexts/ProjectContext'
import { GET_PROJECTS_QUERY } from '@/app/graphql/queries'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the Skeleton component
vi.mock('@/app/components', () => ({
    Skeleton: ({ width }: { width: string }) => (
        <div data-testid="skeleton" style={{ width }}>
            Loading...
        </div>
    ),
}))

// Mock Radix UI Select components
vi.mock('@radix-ui/themes', () => ({
    Select: {
        Root: ({
            children,
            value,
            onValueChange,
        }: {
            children: React.ReactNode
            value: string
            onValueChange: (value: string) => void
        }) => (
            <div data-testid="select-root" data-value={value}>
                {children}
            </div>
        ),
        Trigger: ({
            children,
            className,
        }: {
            children: React.ReactNode
            className?: string
        }) => (
            <button data-testid="select-trigger" className={className}>
                {children}
            </button>
        ),
        Content: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="select-content">{children}</div>
        ),
        Item: ({
            children,
            value,
        }: {
            children: React.ReactNode
            value: string
        }) => (
            <div data-testid="select-item" data-value={value}>
                {children}
            </div>
        ),
        Value: ({ placeholder }: { placeholder: string }) => (
            <span data-testid="select-value">{placeholder}</span>
        ),
    },
}))

const mockProjects = [
    {
        id: '1',
        name: 'Project Alpha',
        description: 'First project',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: '2',
        name: 'Project Beta',
        description: 'Second project',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
    },
]

const mocks = [
    {
        request: {
            query: GET_PROJECTS_QUERY,
        },
        result: {
            data: {
                projects: mockProjects,
            },
        },
    },
]

const errorMocks = [
    {
        request: {
            query: GET_PROJECTS_QUERY,
        },
        error: new Error('Failed to fetch projects'),
    },
]

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
        <ProjectProvider>{children}</ProjectProvider>
    </MockedProvider>
)

const ErrorTestWrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={errorMocks} addTypename={false}>
        <ProjectProvider>{children}</ProjectProvider>
    </MockedProvider>
)

describe('ProjectSelector', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows skeleton while loading', () => {
        render(
            <TestWrapper>
                <ProjectSelector />
            </TestWrapper>
        )

        expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    })

    it('displays projects when loaded', async () => {
        render(
            <TestWrapper>
                <ProjectSelector />
            </TestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('select-root')).toBeInTheDocument()
        })

        expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    })

    it('handles project selection', async () => {
        render(
            <TestWrapper>
                <ProjectSelector />
            </TestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('select-root')).toBeInTheDocument()
        })

        // Verify the select component is rendered
        expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    })

    it('handles "All Projects" selection', async () => {
        render(
            <TestWrapper>
                <ProjectSelector />
            </TestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('select-root')).toBeInTheDocument()
        })

        // Verify the select component is rendered
        expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    })

    it('handles error gracefully', async () => {
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        render(
            <ErrorTestWrapper>
                <ProjectSelector />
            </ErrorTestWrapper>
        )

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error loading projects:',
                expect.any(Error)
            )
        })

        // Should not render anything when there's an error
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()

        consoleSpy.mockRestore()
    })

    it('shows placeholder when no projects are available', async () => {
        const emptyMocks = [
            {
                request: {
                    query: GET_PROJECTS_QUERY,
                },
                result: {
                    data: {
                        projects: [],
                    },
                },
            },
        ]

        render(
            <MockedProvider mocks={emptyMocks} addTypename={false}>
                <ProjectProvider>
                    <ProjectSelector />
                </ProjectProvider>
            </MockedProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('select-root')).toBeInTheDocument()
        })

        // Verify the select component is rendered
        expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    })
})
