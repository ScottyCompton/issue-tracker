import { IssueStatusBadge, Link } from '@/app/components'
import { Issue } from '@/app/lib/interfaces'
import { formatDate } from '@/app/lib/utils'
import { Status } from '@/prisma/client'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { Table } from '@radix-ui/themes'
import NextLink from 'next/link'

export interface IssueQuery {
    status: string
    sortBy?: string
    sortOrder?: string
    page?: string
    pageSize?: string
}

interface Props {
    searchParams: Promise<IssueQuery>
    issues: Issue[]
}

const IssuesList: React.FC<Props> = async ({ searchParams, issues }: Props) => {
    const { status, sortBy, sortOrder, page, pageSize } = await searchParams

    return (
        <>
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        {columns.map((col) => (
                            <Table.ColumnHeaderCell
                                key={col.value}
                                style={{ width: col.width }}
                            >
                                <NextLink
                                    href={{
                                        query: {
                                            status,
                                            sortBy: col.value,
                                            sortOrder:
                                                sortOrder === 'asc'
                                                    ? 'desc'
                                                    : 'asc',
                                            page,
                                            pageSize,
                                        },
                                    }}
                                >
                                    {col.label}
                                </NextLink>
                                {col.value === sortBy &&
                                    (sortOrder === 'asc' ? (
                                        <ArrowUpIcon className="inline" />
                                    ) : (
                                        <ArrowDownIcon className="inline" />
                                    ))}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {issues &&
                        issues.map((issue: Issue) => (
                            <Table.Row key={issue.id}>
                                <Table.Cell>
                                    <Link href={`/issues/${issue.id}`}>
                                        {issue.title}
                                    </Link>
                                    <div className="block md:hidden">
                                        <IssueStatusBadge
                                            status={issue.status}
                                        />
                                    </div>
                                </Table.Cell>
                                <Table.Cell className="hidden md:table-cell">
                                    <IssueStatusBadge status={issue.status} />
                                </Table.Cell>
                                <Table.Cell className="hidden md:table-cell">
                                    {formatDate(issue.createdAt)}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    {issues.length === 0 && (
                        <Table.Row>
                            <Table.Cell
                                colSpan={3}
                                className="py-10 text-center"
                            >
                                No Issues with status of{' '}
                                <IssueStatusBadge status={status as Status} />{' '}
                                found
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </>
    )
}

const columns: {
    label: string
    value: keyof Issue
    className?: string
    width: string
}[] = [
    { label: 'Issue', value: 'title', width: '50%' },
    {
        label: 'Status',
        value: 'status',
        className: 'hidden md:table-cell',
        width: '25%',
    },
    {
        label: 'Created',
        value: 'createdAt',
        className: 'hidden md:table-cell',
        width: '25%',
    },
]

export default IssuesList
