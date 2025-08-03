'use client'

import { Text } from '@radix-ui/themes'

interface Project {
    id: string | number
    name: string
    description?: string | null
}

interface ProjectBadgeProps {
    project: Project | null | undefined
    variant?: 'default' | 'compact'
}

const ProjectBadge: React.FC<ProjectBadgeProps> = ({
    project,
    variant = 'default',
}) => {
    if (!project) return null

    const baseClasses = 'px-2 py-1 rounded-md text-sm font-medium'
    const variantClasses = {
        default: 'bg-blue-100 text-blue-800 border border-blue-200',
        compact: 'bg-blue-50 text-blue-700 text-xs',
    }

    return (
        <Text className={`${baseClasses} ${variantClasses[variant]}`}>
            {project.name}
        </Text>
    )
}

export default ProjectBadge
