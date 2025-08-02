'use client'

import { Status } from '@/app/generated/prisma'
import { UPDATE_ISSUE_MUTATION } from '@/app/graphql/queries'
import { toProperCase } from '@/app/lib/utils'
import { useMutation } from '@apollo/client'
import { Select } from '@radix-ui/themes'
import React from 'react'
import { toast } from 'react-hot-toast'

interface Props {
    issueId: string
    currentStatus: Status
    onStatusChange?: (newStatus: Status) => void
}

const StatusSelect: React.FC<Props> = ({
    issueId,
    currentStatus,
    onStatusChange,
}) => {
    const [updateIssue, { loading }] = useMutation(UPDATE_ISSUE_MUTATION, {
        onCompleted: (data) => {
            const newStatus = data.updateIssue.status
            // Use a unique toast ID to prevent duplicates
            toast.success(`Status changed to ${toProperCase(newStatus)}`, {
                id: `status-change-${issueId}`,
            })
            onStatusChange?.(newStatus)
        },
        onError: (error) => {
            console.error('Status update error:', error)
            toast.error(`Failed to update status: ${error.message}`, {
                id: `status-error-${issueId}`,
            })
        },
        // Update the cache to reflect the status change
        update: (cache, { data }) => {
            if (!data?.updateIssue) return

            const updatedIssue = data.updateIssue

            // Update the issue in the cache
            cache.modify({
                id: cache.identify({ __typename: 'Issue', id: issueId }),
                fields: {
                    status: () => updatedIssue.status,
                },
            })
        },
    })

    const handleStatusChange = (newStatus: string) => {
        // Only proceed if the status is actually different
        if (newStatus === currentStatus) {
            return
        }

        try {
            updateIssue({
                variables: {
                    id: issueId,
                    input: {
                        status: newStatus,
                    },
                },
            })
        } catch (error) {
            console.error('Error calling mutation:', error)
            toast.error('Failed to update status', {
                id: `status-error-${issueId}`,
            })
        }
    }

    const statusOptions = [
        { value: 'OPEN', label: 'Open' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'CLOSED', label: 'Closed' },
    ]

    return (
        <Select.Root
            value={currentStatus}
            onValueChange={handleStatusChange}
            disabled={loading}
        >
            <Select.Trigger placeholder="Select status..." />
            <Select.Content>
                {statusOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                        {option.label}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    )
}

export default StatusSelect
