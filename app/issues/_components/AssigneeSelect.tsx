'use client'
import { Skeleton } from '@/app/components'
import {
    GET_USERS_QUERY,
    UPDATE_ISSUE_ASSIGNEE_MUTATION,
} from '@/app/graphql/queries'
import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Select } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface User {
    id: string
    name: string
    email: string
}

interface Props {
    issueId: string
    assignedToUserId?: string
}

const AssigneeSelect = ({ issueId, assignedToUserId }: Props) => {
    const {
        data: users,
        error,
        isLoading,
    } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () =>
            graphqlClient
                .query({ query: GET_USERS_QUERY })
                .then((res) => res.data.users),
        staleTime: 3600 * 1000,
        retry: 3,
    })

    if (isLoading) return <Skeleton />

    if (error) return null

    const assignIssue = async (userId: string) => {
        toast.dismiss()
        await graphqlClient
            .mutate({
                mutation: UPDATE_ISSUE_ASSIGNEE_MUTATION,
                variables: {
                    id: issueId.toString(),
                    input: {
                        assignedToUserId: userId === '-1' ? null : userId,
                    },
                },
            })
            .then(() => {
                toast.success('Changes saved successfully.')
            })
            .catch((error) => {
                toast.error('Changes could not be saved')
            })
    }

    return (
        <>
            <Select.Root
                defaultValue={assignedToUserId || '-1'}
                onValueChange={assignIssue}
            >
                <Select.Trigger placeholder="Assign..." />
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Suggestions</Select.Label>
                        <Select.Item value="-1">Unassigned</Select.Item>
                        {users?.map((user: User) => (
                            <Select.Item key={user.id} value={user.id}>
                                {user.name}
                            </Select.Item>
                        ))}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </>
    )
}

export default AssigneeSelect
