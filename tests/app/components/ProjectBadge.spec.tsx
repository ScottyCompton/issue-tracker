import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectBadge from '@/app/components/ProjectBadge'

describe('ProjectBadge', () => {
    it('renders project name when project is provided', () => {
        const project = {
            id: 1,
            name: 'Test Project',
            description: 'Test Description'
        }

        render(<ProjectBadge project={project} />)
        
        expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('renders nothing when project is null', () => {
        const { container } = render(<ProjectBadge project={null} />)
        
        expect(container.firstChild).toBeNull()
    })

    it('renders nothing when project is undefined', () => {
        const { container } = render(<ProjectBadge project={undefined} />)
        
        expect(container.firstChild).toBeNull()
    })

    it('applies default variant styles', () => {
        const project = {
            id: 1,
            name: 'Test Project'
        }

        render(<ProjectBadge project={project} />)
        
        const badge = screen.getByText('Test Project')
        expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'border', 'border-blue-200')
    })

    it('applies compact variant styles', () => {
        const project = {
            id: 1,
            name: 'Test Project'
        }

        render(<ProjectBadge project={project} variant="compact" />)
        
        const badge = screen.getByText('Test Project')
        expect(badge).toHaveClass('bg-blue-50', 'text-blue-700', 'text-xs')
    })

    it('handles project with string id', () => {
        const project = {
            id: '1',
            name: 'Test Project'
        }

        render(<ProjectBadge project={project} />)
        
        expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('handles project with number id', () => {
        const project = {
            id: 1,
            name: 'Test Project'
        }

        render(<ProjectBadge project={project} />)
        
        expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
}) 