import { Status } from '@/prisma/client'
import { Text } from '@radix-ui/themes'
import React from 'react'

interface Props {
    status: Status | string
}

const statusMap: Record<
    string,
    { label: string; color: 'red' | 'violet' | 'green' }
> = {
    OPEN: { label: 'Open', color: 'red' },
    IN_PROGRESS: { label: 'In-progress', color: 'violet' },
    CLOSED: { label: 'Closed', color: 'green' },
}

const IssueStatusBadge: React.FC<Props> = ({ status }: Props) => {
    const statusConfig = statusMap[status as string]

    if (!statusConfig) {
        return (
            <Text className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                Unknown
            </Text>
        )
    }

    const colorClasses = {
        red: 'bg-red-100 text-red-800',
        violet: 'bg-violet-100 text-violet-800',
        green: 'bg-green-100 text-green-800',
    }

    return (
        <Text
            className={`px-2 py-1 rounded-md text-xs font-medium ${colorClasses[statusConfig.color]}`}
        >
            {statusConfig.label}
        </Text>
    )
}

export default IssueStatusBadge
