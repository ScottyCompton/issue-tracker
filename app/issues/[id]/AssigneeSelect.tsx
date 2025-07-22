'use client'
import { Select } from '@radix-ui/themes'
import { client as graphqlClient} from '@/app/lib/graphql-client'
import { GET_USERS_QUERY, UPDATE_ISSUE_ASSIGNEE_MUTATION } from '@/app/graphql/queries'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/app/components'


interface User {
    id: string
    name: string
    email: string
}

interface Props {
    issueId: string
    assignedToUserId?: string
}


const AssigneeSelect = ({issueId, assignedToUserId}: Props) => {

    const { data: users, error, isLoading} = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => graphqlClient.query({query: GET_USERS_QUERY}).then(res => res.data.users),
        staleTime: 0,
        retry: 3
    })

    if(isLoading) return <Skeleton />

    if(error) return null


  return (
    <Select.Root 
        defaultValue={assignedToUserId || "-1"}
        onValueChange={async (userId) => {
        await graphqlClient.mutate({
            mutation: UPDATE_ISSUE_ASSIGNEE_MUTATION,
            variables: {
              id: issueId.toString(),
              input: {assignedToUserId: userId === "-1" ? null : userId}
            }
          })
    }}>
	<Select.Trigger placeholder="Assign..." />
	<Select.Content>
		<Select.Group>
			<Select.Label>Suggestions</Select.Label>
            <Select.Item value="-1">Unassigned</Select.Item>
            {users?.map((user:User) => <Select.Item key={user.id} value={user.id}>{user.name}</Select.Item>)}
		</Select.Group>

	</Select.Content>
</Select.Root>

  )
}

export default AssigneeSelect