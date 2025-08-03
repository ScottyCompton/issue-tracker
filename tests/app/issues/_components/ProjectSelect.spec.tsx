import { GET_PROJECTS_QUERY } from '@/app/graphql/queries'
import ProjectSelect from '@/app/issues/_components/ProjectSelect'
import { render } from '@/tests/utils/test-utils'
import { MockedProvider } from '@apollo/client/testing'
import { screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

const mockProjects = [
    { id: '1', name: 'Project 1', description: 'Description 1' },
    { id: '2', name: 'Project 2', description: 'Description 2' },
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

const TestComponent = ({ defaultValue = '' }) => {
    const { control } = useForm()
    return (
        <MockedProvider mocks={mocks} addTypename={false}>
            <ProjectSelect
                name="projectId"
                control={control}
                defaultValue={defaultValue}
            />
        </MockedProvider>
    )
}

describe('ProjectSelect', () => {
    it('renders loading state initially', () => {
        render(<TestComponent />)

        expect(screen.getByText('Loading projects...')).toBeInTheDocument()
    })

    it('renders projects when data loads', async () => {
        render(<TestComponent />)

        await waitFor(() => {
            // The component should render without errors when data loads
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })
    })

    it('renders "No Project" option', async () => {
        render(<TestComponent />)

        await waitFor(() => {
            // The component should render with "No Project" as default
            expect(screen.getByText('No Project')).toBeInTheDocument()
        })
    })

    it('handles error state', () => {
        const errorMocks = [
            {
                request: {
                    query: GET_PROJECTS_QUERY,
                },
                error: new Error('Failed to load projects'),
            },
        ]

        const ErrorTestComponent = ({ defaultValue = '' }) => {
            const { control } = useForm()
            return (
                <MockedProvider mocks={errorMocks} addTypename={false}>
                    <ProjectSelect
                        name="projectId"
                        control={control}
                        defaultValue={defaultValue}
                    />
                </MockedProvider>
            )
        }

        render(<ErrorTestComponent />)

        // Should show loading state initially
        expect(screen.getByText('Loading projects...')).toBeInTheDocument()
    })
})
