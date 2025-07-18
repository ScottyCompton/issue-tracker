import React from 'react'
import delay from 'delay'
import IssuesToolbar from './components/IssuesToolbar'
import IssuesList from './components/IssuesList'

const IssuesPage = async () => {
    await delay(1000)

  return (
    <div>
        <IssuesToolbar />
        <IssuesList />
    </div>
  )
}

export default IssuesPage