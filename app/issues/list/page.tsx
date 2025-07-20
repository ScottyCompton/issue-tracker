import React from 'react'
import delay from 'delay'
import IssuesToolbar from '../_components/IssuesToolbar'
import IssuesList from '../_components/IssuesList'

const IssuesPage:React.FC = async () => {

  return (
    <div>
        <IssuesToolbar />
        <IssuesList />
    </div>
  )
}
export const dynamic = 'force-dynamic';
export default IssuesPage