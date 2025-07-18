import React from 'react'
import { Button, Table } from '@radix-ui/themes'
import Link from 'next/link'
import prisma from '@/prisma/client'
import IssueStatusBadge from '../components/IssueStatusBadge'
import delay from 'delay'
import IssuesToolbar from './components/IssuesToolbar'
import IssuesList from './components/IssuesList'

const IssuesPage = async () => {
  
  const issues = await prisma.issue.findMany()
  await delay(2000)
  return (
    <div>
        <IssuesToolbar />
        <IssuesList />
    </div>
  )
}

export default IssuesPage