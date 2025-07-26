import IssuesToolbar from '../_components/IssuesToolbar'
import IssuesList from '../_components/IssuesList'
import { GET_ISSUES_COUNT_QUERY, GET_ISSUES_QUERY } from '@/app/graphql/queries'
import { client as graphqlClient} from '@/app/lib/graphql-client'
import Pagination from '@/app/components/Pagination'
import { Box } from '@radix-ui/themes'
import { IssueQuery } from '../_components/IssuesList'

interface Props {
  searchParams: Promise<IssueQuery>
}

const IssuesPage:React.FC<Props> = async ({searchParams}: Props) => {
  const {status, sortBy, sortOrder, page} = await searchParams
  const currentPage = page ? parseInt(page) : 1
  const pageSize = 10


  const queryVariables = {
    status,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : undefined,
    paging: {
        skip: (currentPage - 1) * pageSize,
        take: pageSize
    }
  }

  const { data } = await graphqlClient.query({
    query: GET_ISSUES_QUERY,
    variables: queryVariables
  })
  const { issues } = data

  const { data: issuesCountData } = await graphqlClient.query({
    query: GET_ISSUES_COUNT_QUERY,
    variables: {status}
  })
  const { issuesCount } = issuesCountData

  return (
    <div>
        <IssuesToolbar currStatus={status} />
        {<IssuesList searchParams={searchParams} issues={issues} />}
        <Box className="text-center w-full">
            <Pagination pageSize={10} itemCount={issuesCount} currentPage={currentPage} />
        </Box>        
    </div>
  )
}
export const metadata = {
  title: 'Issue Tracker - Issues List',
  description: 'View all project issues'
}

export const dynamic = 'force-dynamic';
export default IssuesPage