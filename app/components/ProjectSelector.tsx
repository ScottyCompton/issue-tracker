'use client'

import { Skeleton } from '@/app/components'
import { useProject } from '@/app/contexts/ProjectContext'
import { GET_PROJECTS_QUERY } from '@/app/graphql/queries'
import { useQuery } from '@apollo/client'
import { Select } from '@radix-ui/themes'
import React from 'react'

interface Project {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string
}

interface ProjectsData {
    projects: Project[]
}

interface ProjectSelectorProps {
    disabled?: boolean
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
    disabled = false,
}) => {
    const { selectedProjectId, setSelectedProjectId } = useProject()

    const { data, loading, error } = useQuery<ProjectsData>(GET_PROJECTS_QUERY)

    if (loading) return <Skeleton width="8rem" />

    if (error) {
        console.error('Error loading projects:', error)
        return null
    }

    const projects = data?.projects || []

    const handleProjectChange = (projectId: string) => {
        if (disabled) return
        setSelectedProjectId(projectId === 'all' ? null : projectId)
    }

    return (
        <Select.Root
            value={selectedProjectId || 'all'}
            onValueChange={handleProjectChange}
            disabled={disabled}
        >
            <Select.Trigger className="w-40" placeholder="Select Project" />
            <Select.Content>
                <Select.Item value="all">All Projects</Select.Item>
                {projects.map((project) => (
                    <Select.Item key={project.id} value={project.id}>
                        {project.name}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    )
}

export default ProjectSelector
