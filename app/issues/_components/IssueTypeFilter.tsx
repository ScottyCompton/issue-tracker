'use client'

import { IssueType } from '@/prisma/client'
import { Select } from '@radix-ui/themes'
import { useRouter, useSearchParams } from 'next/navigation'

const issueTypeArray: { label: string; value: IssueType }[] = [
    { label: 'General', value: 'GENERAL' },
    { label: 'Bug', value: 'BUG' },
    { label: 'Spike', value: 'SPIKE' },
    { label: 'Task', value: 'TASK' },
    { label: 'Subtask', value: 'SUBTASK' },
]

interface Props {
    currIssueType?: string
}

// Export the handleSelect function for testing
export const handleSelect = (
    issueType: string,
    searchParams: URLSearchParams,
    router: any
) => {
    const params = new URLSearchParams()
    if (issueType && issueType !== '-1') params.append('issueType', issueType)
    if (searchParams.get('status'))
        params.append('status', searchParams.get('status')!)
    if (searchParams.get('sortBy'))
        params.append('sortBy', searchParams.get('sortBy')!)
    if (searchParams.get('sortOrder'))
        params.append('sortOrder', searchParams.get('sortOrder')!)
    if (searchParams.get('page'))
        params.append('page', searchParams.get('page')!)
    if (searchParams.get('pageSize'))
        params.append('pageSize', searchParams.get('pageSize')!)
    if (searchParams.get('userId'))
        params.append('userId', searchParams.get('userId')!)

    const query = params.size ? '?' + params.toString() : ''
    console.log(query)
    router.push(`/issues/list${query}`)
}

const IssueTypeFilter: React.FC<Props> = ({ currIssueType }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    return (
        <Select.Root
            onValueChange={(value) =>
                handleSelect(value as IssueType, searchParams, router)
            }
            defaultValue={currIssueType}
        >
            <Select.Trigger placeholder="Filter by type..." className="w-50" />
            <Select.Content className="w-50">
                <Select.Group>
                    <Select.Item key="-1" value="-1">
                        All
                    </Select.Item>
                    {issueTypeArray.map((t) => (
                        <Select.Item key={t.value} value={t.value + ''}>
                            {t.label}
                        </Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    )
}

export default IssueTypeFilter
