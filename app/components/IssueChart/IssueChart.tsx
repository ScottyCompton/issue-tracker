import { client as graphqlClient } from '@/app/lib/graphql-client'
import { GET_ISSUES_STATUS_COUNT_QUERY } from '../../graphql/queries'
import { Card } from '@radix-ui/themes'
import IssuesBarChart from './IssuesBarChart'


interface IssueStatusCount {
    label: string
    status: string
    count: number
}


const IssueChart = async () => {

    const { data } = await graphqlClient.query({
        query: GET_ISSUES_STATUS_COUNT_QUERY
      })
     
     const { issueStatusCount } = data

  return (
    <Card className='mt-5'>
        <IssuesBarChart issueData={issueStatusCount} />
    </Card>
  )
}

export default IssueChart