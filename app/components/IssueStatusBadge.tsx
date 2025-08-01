import { Status } from '@/prisma/client'
import { Badge } from '@radix-ui/themes'
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
        return <Badge color="gray">Unknown</Badge>
    }

    return <Badge color={statusConfig.color}>{statusConfig.label}</Badge>
}

export default IssueStatusBadge
