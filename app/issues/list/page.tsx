import React from 'react'
import delay from 'delay'
import IssuesToolbar from '../_components/IssuesToolbar'
import IssuesList from '../_components/IssuesList'

interface Props {
  searchParams: Promise<{
    status: string
  }>
}


const IssuesPage:React.FC<Props> = async ({searchParams}: Props) => {
  const {status} = await searchParams
  return (
    <div>
        <IssuesToolbar currStatus={status} />
        <IssuesList filter={status} />
    </div>
  )
}
export const dynamic = 'force-dynamic';
export default IssuesPage