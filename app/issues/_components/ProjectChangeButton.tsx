'use client'

import { useProject } from '@/app/contexts/ProjectContext'
import {
    GET_PROJECTS_QUERY,
    UPDATE_ISSUE_MUTATION,
} from '@/app/graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Select } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BsPencil } from 'react-icons/bs'

interface Project {
    id: string
    name: string
    description?: string | null
}

interface ProjectChangeButtonProps {
    issueId: string
    currentProjectId: string | null
    currentProjectName?: string | null
}

const ProjectChangeButton: React.FC<ProjectChangeButtonProps> = ({
    issueId,
    currentProjectId,
    currentProjectName,
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState(
        currentProjectId || ''
    )
    const { setSelectedProjectId: setContextProjectId } = useProject()
    const router = useRouter()

    const { data, loading } = useQuery(GET_PROJECTS_QUERY)
    const [updateIssue, { loading: isUpdating }] = useMutation(
        UPDATE_ISSUE_MUTATION
    )

    const projects = data?.projects || []

    const handleProjectChange = async () => {
        try {
            await updateIssue({
                variables: {
                    id: issueId,
                    input: {
                        projectId: selectedProjectId || null,
                    },
                },
            })

            // Update the ProjectContext to reflect the new project
            if (selectedProjectId) {
                setContextProjectId(selectedProjectId)
            } else {
                setContextProjectId(null)
            }

            setIsEditing(false)

            // Refresh the page data without full reload
            router.refresh()
        } catch (error) {
            console.error('Failed to update project:', error)
        }
    }

    const handleCancel = () => {
        setSelectedProjectId(currentProjectId || '')
        setIsEditing(false)
    }

    if (loading) {
        return <Button disabled>Loading...</Button>
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Select.Root
                    value={selectedProjectId || 'none'}
                    onValueChange={(value) =>
                        setSelectedProjectId(value === 'none' ? '' : value)
                    }
                >
                    <Select.Trigger placeholder="Select Project" />
                    <Select.Content>
                        <Select.Item value="none">No Project</Select.Item>
                        {projects.map((project: Project) => (
                            <Select.Item key={project.id} value={project.id}>
                                {project.name}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
                <Button
                    size="1"
                    onClick={handleProjectChange}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button
                    size="1"
                    variant="soft"
                    onClick={handleCancel}
                    disabled={isUpdating}
                >
                    Cancel
                </Button>
            </div>
        )
    }

    return (
        <Button size="1" variant="soft" onClick={() => setIsEditing(true)}>
            <BsPencil className="mr-1" />
            Change Project
        </Button>
    )
}

export default ProjectChangeButton
