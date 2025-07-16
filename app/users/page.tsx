import React, { Suspense } from 'react'
import UserTable from './components/UserTable'
import Link from 'next/link'
import Loading from '../loading'

interface Props {
  searchParams: Promise<{
    sortBy: string
    sortOrder: string
  }>
}

const UsersPage = async ({ searchParams }: Props) => {
  const { sortOrder, sortBy } = await searchParams;

  return (
    <main>
      <h1>Users</h1>
      <Link href="/users/new" className='btn'>New User</Link>
      <Suspense fallback={<Loading />}>
        <UserTable sortOrder={sortOrder} sortBy={sortBy} />
      </Suspense>
    </main>
  )
}

export default UsersPage