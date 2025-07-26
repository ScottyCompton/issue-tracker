'use client'

import { Select } from '@radix-ui/themes'
import { Status } from '@/app/generated/prisma'
import { useRouter, useSearchParams } from 'next/navigation'

const statusArray: { label: string; value: Status }[] = [
    { label: 'Open', value: Status.OPEN },
    { label: 'In-Progress', value: Status.IN_PROGRESS },
    { label: 'Closed', value: Status.CLOSED },
]

interface Props {
    currStatus?: string
}

const IssueStatusFilter: React.FC<Props> = ({ currStatus }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSelect = (status: string) => {
        const params = new URLSearchParams()
        if (status && status !== '-1') params.append('status', status)
        if (searchParams.get('sortyBy'))
            params.append('sortBy', searchParams.get('sortBy')!)
        if (searchParams.get('sortOrder'))
            params.append('sortOrder', searchParams.get('sortOrder')!)

        const query = params.size ? '?' + params.toString() : ''
        console.log(query)
        router.push(`/issues/list/${query}`)
    }
    return (
        <Select.Root
            onValueChange={(value) => handleSelect(value as Status)}
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
                        <Select.Item
                            key={Math.floor(Math.random() * 1000)}
                            value={s.value + ''}
                        >
                            {s.label}
                        </Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    )
}

export default IssueStatusFilter
