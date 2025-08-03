'use client'

import { Skeleton } from '@/app/components'
import { useProject } from '@/app/contexts/ProjectContext'
import { GET_PROJECTS_QUERY } from '@/app/graphql/queries'
import { useQuery } from '@apollo/client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@radix-ui/themes'
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

const ProjectSelector: React.FC = () => {
    const { selectedProjectId, setSelectedProjectId } = useProject()

    const { data, loading, error } = useQuery<ProjectsData>(GET_PROJECTS_QUERY)

    if (loading) return <Skeleton width="8rem" />

    if (error) {
        console.error('Error loading projects:', error)
        return null
    }

    const projects = data?.projects || []

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId === 'all' ? null : projectId)
    }

    return (
        <Select
            value={selectedProjectId || 'all'}
            onValueChange={handleProjectChange}
        >
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default ProjectSelector
