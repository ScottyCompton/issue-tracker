'use client'

import { Status } from '@/prisma/client'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts'
import { useRouter } from 'next/navigation'

interface IssueStatusCount {
    label: string
    status: string
    count: number
}

interface Props {
    issueData: IssueStatusCount[]
}

const IssuesBarChart: React.FC<Props> = ({ issueData }: Props) => {
    const router = useRouter()

    const handleBarClick = (data: any) => {
        const status = data.status
        const url = status ? `/issues/list/?status=${status}` : '/issues/list/'
        router.push(url)
    }

    return (
        <ResponsiveContainer
            width="100%"
            height={300}
            style={{ outline: 'none' }}
        >
            <BarChart data={issueData}>
                <XAxis dataKey="label" tick={{ fontSize: 12 }}></XAxis>
                <YAxis width={20} />
                <Bar
                    dataKey="count"
                    barSize={60}
                    style={{ fill: 'var(--violet-a11)', cursor: 'pointer' }}
                    onClick={handleBarClick}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default IssuesBarChart
