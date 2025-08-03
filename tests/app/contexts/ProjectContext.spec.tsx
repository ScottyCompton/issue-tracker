import { ProjectProvider, useProject } from '@/app/contexts/ProjectContext'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

// Test component that uses the context
const TestComponent = () => {
    const {
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        setSelectedProject,
    } = useProject()

    return (
        <div>
            <div data-testid="project-id">{selectedProjectId || 'null'}</div>
            <div data-testid="project-name">
                {selectedProject?.name || 'null'}
            </div>
            <button
                data-testid="set-project-id"
                onClick={() => setSelectedProjectId('123')}
            >
                Set Project ID
            </button>
            <button
                data-testid="clear-project-id"
                onClick={() => setSelectedProjectId(null)}
            >
                Clear Project ID
            </button>
            <button
                data-testid="set-project"
                onClick={() =>
                    setSelectedProject({
                        id: '123',
                        name: 'Test Project',
                        createdAt: '2024-01-01',
                        updatedAt: '2024-01-01',
                    })
                }
            >
                Set Project
            </button>
        </div>
    )
}

describe('ProjectContext', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        localStorageMock.getItem.mockClear()
        localStorageMock.setItem.mockClear()
        localStorageMock.removeItem.mockClear()
    })

    it('provides initial state', () => {
        render(
            <ProjectProvider>
                <TestComponent />
            </ProjectProvider>
        )

        expect(screen.getByTestId('project-id')).toHaveTextContent('null')
        expect(screen.getByTestId('project-name')).toHaveTextContent('null')
    })

    it('loads project ID from localStorage on mount', () => {
        localStorageMock.getItem.mockReturnValue('456')

        render(
            <ProjectProvider>
                <TestComponent />
            </ProjectProvider>
        )

        expect(localStorageMock.getItem).toHaveBeenCalledWith(
            'selectedProjectId'
        )
        expect(screen.getByTestId('project-id')).toHaveTextContent('456')
    })

    it('sets project ID and saves to localStorage', async () => {
        render(
            <ProjectProvider>
                <TestComponent />
            </ProjectProvider>
        )

        fireEvent.click(screen.getByTestId('set-project-id'))

        await waitFor(() => {
            expect(screen.getByTestId('project-id')).toHaveTextContent('123')
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'selectedProjectId',
            '123'
        )
    })

    it('clears project ID and removes from localStorage', async () => {
        render(
            <ProjectProvider>
                <TestComponent />
            </ProjectProvider>
        )

        // First set a project ID
        fireEvent.click(screen.getByTestId('set-project-id'))

        // Then clear it
        fireEvent.click(screen.getByTestId('clear-project-id'))

        await waitFor(() => {
            expect(screen.getByTestId('project-id')).toHaveTextContent('null')
        })

        expect(localStorageMock.removeItem).toHaveBeenCalledWith(
            'selectedProjectId'
        )
    })

    it('sets and manages project object', async () => {
        render(
            <ProjectProvider>
                <TestComponent />
            </ProjectProvider>
        )

        fireEvent.click(screen.getByTestId('set-project'))

        await waitFor(() => {
            expect(screen.getByTestId('project-name')).toHaveTextContent(
                'Test Project'
            )
        })
    })

    it('throws error when used outside provider', () => {
        // Suppress console.error for this test
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        expect(() => {
            render(<TestComponent />)
        }).toThrow('useProject must be used within a ProjectProvider')

        consoleSpy.mockRestore()
    })
})
