'use client'
import { Skeleton } from '@/app/components'
import {
    GET_USERS_QUERY,
    UPDATE_ISSUE_ASSIGNEE_MUTATION,
} from '@/app/graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { Select } from '@radix-ui/themes'
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
        data: usersData,
        error,
        loading,
    } = useQuery<{ users: User[] }>(GET_USERS_QUERY)

    const [updateIssueAssignee] = useMutation(UPDATE_ISSUE_ASSIGNEE_MUTATION)

    if (loading) return <Skeleton />

    if (error) return null

    const assignIssue = async (userId: string) => {
        toast.dismiss()
        try {
            await updateIssueAssignee({
                variables: {
                    id: issueId.toString(),
                    input: {
                        assignedToUserId: userId === '-1' ? null : userId,
                    },
                },
            })
            toast.success('Changes saved successfully.')
        } catch (error) {
            toast.error('Changes could not be saved')
        }
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
                        {usersData?.users?.map((user: User) => (
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
