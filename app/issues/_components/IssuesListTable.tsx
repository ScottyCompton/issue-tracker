import { IssueStatusBadge, Link } from '@/app/components'
import { Issue } from '@/app/lib/interfaces'
import { formatDate } from '@/app/lib/utils'
import { Status } from '@/prisma/client'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { Table } from '@radix-ui/themes'
import NextLink from 'next/link'
import React from 'react'

export interface IssueListTableColumn {
    label: string
    value: keyof Issue
    className?: string
    width: string
}

interface Props {
    columns: IssueListTableColumn[]
    issues: Issue[]
    status: string
    sortBy?: string
    sortOrder?: string
    page?: string
    pageSize?: string
    userId?: string
    currentUser?: {
        id: string
        name: string
        email: string
        image?: string
    }
    formatIssueType: (issueType: string) => string
    onSort?: (col: IssueListTableColumn) => void
}

const IssuesListTable: React.FC<Props> = ({
    columns,
    issues,
    status,
    sortBy,
    sortOrder,
    page,
    pageSize,
    userId,
    currentUser,
    formatIssueType,
    onSort,
}) => {
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    {columns.map((col) => (
                        <Table.ColumnHeaderCell
                            key={col.value}
                            style={{ width: col.width }}
                            className={col.className}
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
                                        userId,
                                    },
                                }}
                                onClick={
                                    onSort
                                        ? (e) => {
                                              e.preventDefault()
                                              onSort(col)
                                          }
                                        : undefined
                                }
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
                                    <IssueStatusBadge status={issue.status} />
                                </div>
                            </Table.Cell>
                            <Table.Cell className="hidden md:table-cell">
                                <IssueStatusBadge status={issue.status} />
                            </Table.Cell>
                            <Table.Cell className="hidden md:table-cell">
                                {formatIssueType(issue.issueType)}
                            </Table.Cell>
                            <Table.Cell className="hidden md:table-cell">
                                {formatDate(issue.createdAt)}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                {issues.length === 0 && (
                    <Table.Row>
                        <Table.Cell colSpan={4} className="py-30 text-center">
                            {userId && currentUser ? (
                                <>
                                    <strong>{currentUser.name}</strong>{' '}
                                    currently has no issues assigned to them.
                                </>
                            ) : (
                                <>
                                    No Issues with status of{' '}
                                    <IssueStatusBadge
                                        status={status as Status}
                                    />{' '}
                                    found
                                </>
                            )}
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default IssuesListTable
