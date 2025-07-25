import { client as graphqlClient} from '@/app/lib/graphql-client'
import { GET_LATEST_ISSUES_QUERY } from '../graphql/queries'
import { Avatar, Card, Flex, Heading, Table } from '@radix-ui/themes'
import { Issue } from '@/app/interfaces'
import Link from 'next/link'
import IssueStatusBadge from './IssueStatusBadge'


const LatestIssues:React.FC = async () => {

  const { data } = await graphqlClient.query({
    query: GET_LATEST_ISSUES_QUERY
  })
 
 const { latestIssues } = data

  return (
    <Card>
    <Heading size="4" mb="5">Latest Issues</Heading>
    <Table.Root>
      <Table.Body>
        {latestIssues.map((issue: Issue) => (
          <Table.Row key={issue.id}>
            <Table.Cell>
              <Flex justify="between">
                <Flex direction="column" align="start" gap="2">
                  <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                  <IssueStatusBadge status={issue.status} />
                </Flex>
                {issue.assignedToUser && 
                  <Avatar src={issue.assignedToUser.image!} fallback="?" size="2" radius="full" />
                }

              </Flex>
            </Table.Cell>
          </Table.Row>
        ))}

      </Table.Body>
    </Table.Root>
    </Card>
  )
}

export default LatestIssues