import Link from 'next/link'
import React from 'react'
import { sort } from 'fast-sort'

interface User {
    id: number
    name: string
    email: string
}

interface Props {
    sortOrder: string
    sortBy: string
}

const UserTable = async ({ sortOrder, sortBy }: Props) => {

  const users = await fetch('https://jsonplaceholder.typicode.com/users', 
    { cache: 'no-store'})
    .then(res => res.json())
    .then(data => data as User[])
    .then(unsorted => sortOrder === 'asc' ? sort(unsorted).asc(sortBy === 'email' ? (user) => user.email : (user) => user.name) : sort(unsorted).desc(sortBy === 'email' ? (user) => user.email : (user) => user.name))

  return (
    <table className='table table-bordered'>
        <thead>
            <tr>
                <th><Link href={`/users?sortOrder=${sortOrder === 'asc' ? 'desc' : 'asc'}&sortBy=name`}>Name</Link></th>
                <th><Link href={`/users?sortOrder=${sortOrder === 'asc' ? 'desc' : 'asc'}&sortBy=email`}>Email</Link></th>
            </tr>
        </thead>
        <tbody>
            {users && users.map((user) => (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default UserTable