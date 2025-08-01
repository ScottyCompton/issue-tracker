'use client'

import { Status } from '@/app/generated/prisma'
import { Select } from '@radix-ui/themes'
import { useRouter, useSearchParams } from 'next/navigation'

const statusArray: { label: string; value: Status }[] = [
    { label: 'Open', value: Status.OPEN },
    { label: 'In-Progress', value: Status.IN_PROGRESS },
    { label: 'Closed', value: Status.CLOSED },
]

interface Props {
    currStatus?: string
}

// Export the handleSelect function for testing
export const handleSelect = (
    status: string,
    searchParams: URLSearchParams,
    router: any
) => {
    const params = new URLSearchParams()
    if (status && status !== '-1') params.append('status', status)
    if (searchParams.get('sortBy'))
        params.append('sortBy', searchParams.get('sortBy')!)
    if (searchParams.get('sortOrder'))
        params.append('sortOrder', searchParams.get('sortOrder')!)
    if (searchParams.get('page'))
        params.append('page', searchParams.get('page')!)
    if (searchParams.get('pageSize'))
        params.append('pageSize', searchParams.get('pageSize')!)

    const query = params.size ? '?' + params.toString() : ''
    console.log(query)
    router.push(`/issues/list/${query}`)
}

const IssueStatusFilter: React.FC<Props> = ({ currStatus }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    return (
        <Select.Root
            onValueChange={(value) =>
                handleSelect(value as Status, searchParams, router)
            }
            defaultValue={currStatus}
        >
            <Select.Trigger
                placeholder="Filter by status..."
                className="w-50"
            />
            <Select.Content className="w-50">
                <Select.Group>
                    <Select.Item key="-1" value="-1">
                        All
                    </Select.Item>
                    {statusArray.map((s) => (
                        <Select.Item key={s.value} value={s.value + ''}>
                            {s.label}
                        </Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    )
}

export default IssueStatusFilter
