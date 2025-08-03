import { Issue } from '@/app/lib/interfaces'
import IssuesListTable, { IssueListTableColumn } from './IssuesListTable'

export interface IssueQuery {
    status: string
    issueType?: string
    sortBy?: string
    sortOrder?: string
    page?: string
    pageSize?: string
    userId?: string
}

interface Props {
    searchParams: IssueQuery
    issues: Issue[]
    currentUser?: {
        id: string
        name: string
        email: string
        image?: string
    }
}

const columns: IssueListTableColumn[] = [
    { label: 'Issue', value: 'title', width: '40%' },
    {
        label: 'Status',
        value: 'status',
        className: 'hidden md:table-cell',
        width: '20%',
    },
    {
        label: 'Type',
        value: 'issueType',
        className: 'hidden md:table-cell',
        width: '20%',
    },
    {
        label: 'Created',
        value: 'createdAt',
        className: 'hidden md:table-cell',
        width: '20%',
    },
]

const formatIssueType = (issueType: string) => {
    return issueType.charAt(0) + issueType.slice(1).toLowerCase()
}

const IssuesList: React.FC<Props> = ({
    searchParams,
    issues,
    currentUser,
}: Props) => {
    const { status, sortBy, sortOrder, page, pageSize, userId } = searchParams

    return (
        <IssuesListTable
            columns={columns}
            issues={issues}
            status={status}
            sortBy={sortBy}
            sortOrder={sortOrder}
            page={page}
            pageSize={pageSize}
            userId={userId}
            currentUser={currentUser}
            formatIssueType={formatIssueType}
        />
    )
}

export default IssuesList
