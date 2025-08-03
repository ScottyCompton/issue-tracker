import { ProjectProvider } from '@/app/contexts/ProjectContext'
import {
    GET_PROJECTS_QUERY,
    UPDATE_ISSUE_MUTATION,
} from '@/app/graphql/queries'
import ProjectChangeButton from '@/app/issues/_components/ProjectChangeButton'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
    }),
}))

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
    {
        request: {
            query: UPDATE_ISSUE_MUTATION,
            variables: {
                id: '1',
                input: {
                    projectId: '2',
                },
            },
        },
        result: {
            data: {
                updateIssue: {
                    id: '1',
                    projectId: '2',
                },
            },
        },
    },
]

describe('ProjectChangeButton', () => {
    beforeEach(() => {
        // Mock window.location.reload
        Object.defineProperty(window, 'location', {
            value: {
                reload: vi.fn(),
            },
            writable: true,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders change project button initially', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <ProjectProvider>
                    <ProjectChangeButton
                        issueId="1"
                        currentProjectId="1"
                        currentProjectName="Project 1"
                    />
                </ProjectProvider>
            </MockedProvider>
        )

        await waitFor(() => {
            expect(screen.getByRole('button')).toBeInTheDocument()
        })
    })

    it('shows loading state when projects are loading', () => {
        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <ProjectProvider>
                    <ProjectChangeButton
                        issueId="1"
                        currentProjectId="1"
                        currentProjectName="Project 1"
                    />
                </ProjectProvider>
            </MockedProvider>
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
})
