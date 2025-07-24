import { notFound } from "next/navigation"
import { client as graphqlClient } from '@/app/lib/graphql-client'
import { GET_ISSUE_QUERY } from '@/app/graphql/queries'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/auth/authOptions'
import { Box, Flex, Grid } from '@radix-ui/themes'
import IssueDetails from '../_components/IssueDetails'
import EditIssueButton from '../_components/EditIssueButton'
import DeleteIssueButton from '../_components/DeleteIssueButton'
import AssigneeSelect from "../_components/AssigneeSelect"

interface Props {
    params: Promise<{
        id: string
    }>
}

const IssueDetailsPage: React.FC<Props> = async ({ params }: Props) => {
    const session = await getServerSession(authOptions)
    const { id } = await params

    const issue = await graphqlClient.query({
        query: GET_ISSUE_QUERY,
        variables: { id }
    }).then(res => res.data.issue)

    if (!issue) notFound()

    return (
        <Grid columns={{ initial: '1', sm: '5' }} gap="5">
            <Box className="md:col-span-4">
                <IssueDetails issue={issue} />
            </Box>
            {session && <Box>
                <Flex direction="column" gap="4">
                    <AssigneeSelect issueId={issue.id} assignedToUserId={issue.assignedToUserId} />
                    <EditIssueButton issueId={id} />
                    <DeleteIssueButton issueId={id} />
                </Flex>
            </Box>}
        </Grid>
    )
}

export default IssueDetailsPage
