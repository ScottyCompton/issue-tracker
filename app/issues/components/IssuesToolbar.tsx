import { Button } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'

const IssuesToolbar = ({loading = false}: {loading?: boolean}) => {
  return (
    <div className='mb-5 text-right'><Button disabled={loading}><Link href='/issues/new/'>Create Issue</Link></Button></div>
)
}

export default IssuesToolbar