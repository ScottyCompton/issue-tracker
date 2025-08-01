'use client'

import { GET_USERS_QUERY } from '@/app/graphql/queries'
import allUserImg from '@/public/images/all_users.jpg'
import { useQuery } from '@apollo/client'
import { Avatar, Flex } from '@radix-ui/themes'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import UserFilterSkeleton from './UserFilterSkeleton'

interface User {
    id: string
    name: string
    email: string
    image: string
}

interface Props {
    currUserId?: string
}

// Export the handleUserSelect function for testing
export const handleUserSelect = (
    userId: string | null,
    searchParams: URLSearchParams,
    router: any
) => {
    // Start with current URL parameters
    const params = new URLSearchParams(searchParams.toString())

    // Always remove userId first
    params.delete('userId')

    // Only add userId back if it's not null
    if (userId !== null && userId !== '-1') {
        params.set('userId', userId)
    }

    // Build the URL with trailing slash
    const queryString = params.toString()
    const url = queryString ? `/issues/list/?${queryString}` : '/issues/list/'

    router.push(url)
}

const UserFilter: React.FC<Props> = ({ currUserId }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedUserId, setSelectedUserId] = useState<string | null>(
        currUserId || null
    )

    const { data, loading, error } = useQuery<{ users: User[] }>(
        GET_USERS_QUERY
    )

    if (loading) return <UserFilterSkeleton />
    if (error) return <div>Error loading users</div>

    const users = data?.users || []

    const allUsers = [
        {
            __typename: 'User',
            id: '-1',
            name: 'All Users',
            email: 'therealscottycompton@gmail.com',
            image: allUserImg,
        },
        ...users,
    ]

    const handleUserClick = (userId: string | null) => {
        const actualUserId = userId === '-1' ? null : userId
        setSelectedUserId(actualUserId)
        handleUserSelect(actualUserId, searchParams, router)
    }

    return (
        <Flex gap="1" align="center">
            {/* Individual user avatars */}
            {allUsers.map((user) => (
                <div
                    key={user.id}
                    data-testid={`avatar-${user.id}`}
                    onClick={() => handleUserClick(user.id)}
                    className="cursor-pointer"
                    title={user.name}
                >
                    <Avatar
                        size="1"
                        radius="full"
                        src={
                            typeof user.image === 'string'
                                ? user.image
                                : user.image.src
                        }
                        fallback={user.name.charAt(0).toUpperCase()}
                        className={`${
                            selectedUserId === user.id
                                ? 'border-blue-500'
                                : 'border-gray-200'
                        }`}
                    />
                </div>
            ))}
        </Flex>
    )
}

export default UserFilter
