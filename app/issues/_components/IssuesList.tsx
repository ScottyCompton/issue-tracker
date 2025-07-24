import { IssueStatusBadge, Link } from '@/app/components'
import { Table } from '@radix-ui/themes'
import { client as graphqlClient} from '@/app/lib/graphql-client'
import { Status } from '@/app/generated/prisma'
import { GET_ISSUES_QUERY } from '@/app/graphql/queries'
import { formatDate } from '@/app/lib/utils'
import NextLink from 'next/link'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'


interface Issue {
    id: number,
    title: string,
    status: Status,
    createdAt: Date
}

interface Props {
   filter?: string
   sortBy?: string
   sortOrder?: string

}

interface Column {
    label: string
    value: keyof Issue 
    className?: string
    width: string
}

const IssuesList:React.FC<Props> = async ({filter, sortBy, sortOrder}: Props) => {

    const columns:Column[] = [
        {label: 'Issue', value: 'title', width: '50%'},
        {label: 'Status', value: 'status', className: 'hidden md:table-cell', width: '25%'},
        {label: 'Created', value: 'createdAt', className: 'hidden md:table-cell', width: '25%'},
    ]

    const { data } = await graphqlClient.query({
      query: GET_ISSUES_QUERY,
      variables: {orderBy: {title: sortOrder}}
    })

    const issues = filter ? data.issues.filter((item: Issue) => item.status.toString() === filter) : data.issues

    return (
        <>
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                          {columns.map((col) => (
                            <Table.ColumnHeaderCell key={col.value} style={{width: col.width}}>
                              <NextLink href={{
                                query: {
                                    status: filter,
                                    sortBy: col.value,
                                    sortOrder: sortOrder === 'asc' ? 'desc' : 'asc'
                                }}
                              }>{col.label}</NextLink>
                              {col.value === sortBy && (
                                sortOrder === 'asc' ? <ArrowUpIcon className='inline' /> : <ArrowDownIcon className='inline' />
                              )}
                            </Table.ColumnHeaderCell>
                          ))}

                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {issues && issues.map((issue:Issue) => (
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
                        {issues.length === 0 && 
                            <Table.Row>
                                <Table.Cell colSpan={3} className='py-10 text-center'>No Issues with status of <IssueStatusBadge status={filter as Status} /> found</Table.Cell>
                            </Table.Row>
                        }
                    </Table.Body>
                </Table.Root>
        </>
    )
}

export default IssuesList
