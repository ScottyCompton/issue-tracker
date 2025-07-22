'use client'
import { Select } from '@radix-ui/themes'
import { client as graphqlClient} from '@/app/lib/graphql-client'
import { GET_USERS_QUERY } from '@/app/graphql/queries'
import { useEffect, useState } from 'react'

interface User {
    id: string
    name: string
    email: string
}

const AssigneeSelect = () => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const {data} = await graphqlClient.query({
                query: GET_USERS_QUERY
            })
            const {users} = data
            setUsers(users)
        }
        fetchUsers()
    }, [])

  return (
    <Select.Root>
	<Select.Trigger placeholder="Assign..." />
	<Select.Content>
		<Select.Group>
			<Select.Label>Suggestions</Select.Label>
            {users && users.map((user:User) => <Select.Item key={user.id} value={user.id}>{user.name}</Select.Item>)}
		</Select.Group>

	</Select.Content>
</Select.Root>

  )
}

export default AssigneeSelect