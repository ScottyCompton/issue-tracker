import { IssueStatusBadge, Link } from '@/app/components'
import { Table } from '@radix-ui/themes'
import { client as graphqlClient} from '@/app/lib/graphql-client'
import { Status } from '@/app/generated/prisma'
import { GET_ISSUES_QUERY } from '@/app/graphql/queries'
import { formatDate } from '@/app/lib/utils'



interface Issue {
    id: number,
    title: string,
    status: Status,
    createdAt: Date
}


const IssuesList:React.FC = async () => {
    const { data } = await graphqlClient.query({
      query: GET_ISSUES_QUERY
    })
    const { issues } = data
    return (
        <>
            {issues.length > 0 && (
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>
                                Issue
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="hidden md:table-cell">
                                Status
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="hidden md:table-cell">
                                Created
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {issues.map((issue:Issue) => (
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
                    </Table.Body>
                </Table.Root>
            )}
        </>
    )
}

export default IssuesList
