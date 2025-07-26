'use client'

import { Status } from '@/prisma/client'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts'

interface IssueStatusCount {
    label: string
    status: string
    count: number
}

interface Props {
    issueData: IssueStatusCount[]
}


const IssuesBarChart:React.FC<Props> = ({issueData}: Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={issueData}>
        <XAxis dataKey="label"></XAxis>
        <YAxis />
        <Bar dataKey="count" barSize={60} style={{fill: 'var(--violet-a11)'}} />
    </BarChart>
</ResponsiveContainer>
  )
}

export default IssuesBarChart