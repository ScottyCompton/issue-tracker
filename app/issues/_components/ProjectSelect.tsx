'use client'

import { GET_PROJECTS_QUERY } from '@/app/graphql/queries'
import { useQuery } from '@apollo/client'
import { Select } from '@radix-ui/themes'
import { Control, Controller } from 'react-hook-form'

interface Project {
    id: string
    name: string
    description?: string | null
}

interface ProjectSelectProps {
    name: string
    control: Control<any>
    defaultValue?: string | null
    placeholder?: string
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({
    name,
    control,
    defaultValue,
    placeholder = 'Select Project',
}) => {
    const { data, loading, error } = useQuery(GET_PROJECTS_QUERY)

    if (loading) {
        return (
            <Select.Root disabled>
                <Select.Trigger placeholder="Loading projects..." />
            </Select.Root>
        )
    }

    if (error) {
        return (
            <Select.Root disabled>
                <Select.Trigger placeholder="Error loading projects" />
            </Select.Root>
        )
    }

    const projects = data?.projects || []

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
                <Select.Root
                    value={field.value || 'none'}
                    onValueChange={(value) =>
                        field.onChange(value === 'none' ? '' : value)
                    }
                >
                    <Select.Trigger placeholder={placeholder} />
                    <Select.Content>
                        <Select.Item value="none">No Project</Select.Item>
                        {projects.map((project: Project) => (
                            <Select.Item key={project.id} value={project.id}>
                                {project.name}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            )}
        />
    )
}

export default ProjectSelect
