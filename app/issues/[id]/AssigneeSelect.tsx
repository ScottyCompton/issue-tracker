'use client'
import { Select } from '@radix-ui/themes'
import { client as graphqlClient} from '@/app/lib/graphql-client'
import { GET_USERS_QUERY } from '@/app/graphql/queries'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/app/components'

interface User {
    id: string
    name: string
    email: string
}

const AssigneeSelect = () => {
    const { data: users, error, isLoading} = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => graphqlClient.query({query: GET_USERS_QUERY}).then(res => res.data.users),
        staleTime: 6000,
        retry: 3
    })

    if(isLoading) return <Skeleton />

    if(error) return null


  return (
    <Select.Root>
	<Select.Trigger placeholder="Assign..." />
	<Select.Content>
		<Select.Group>
			<Select.Label>Suggestions</Select.Label>
            {users?.map((user:User) => <Select.Item key={user.id} value={user.id}>{user.name}</Select.Item>)}
		</Select.Group>

	</Select.Content>
</Select.Root>

  )
}

export default AssigneeSelect