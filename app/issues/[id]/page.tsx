import authOptions from '@/app/auth/authOptions'
import { GET_ISSUE_QUERY } from '@/app/graphql/queries'
import { client as graphqlClient } from '@/app/lib/graphql-client'
import { Box, Flex, Grid } from '@radix-ui/themes'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import AssigneeSelect from '../_components/AssigneeSelect'
import DeleteIssueButton from '../_components/DeleteIssueButton'
import EditIssueButton from '../_components/EditIssueButton'
import IssueDetails from '../_components/IssueDetails'

interface Props {
    params: Promise<{
        id: string
    }>
}

const fetchIssue = cache(async (id: string) => {
    const issue = await graphqlClient
        .query({
            query: GET_ISSUE_QUERY,
            variables: { id },
        })
        .then((res) => res.data.issue)

    return issue
})

const IssueDetailsPage: React.FC<Props> = async ({ params }: Props) => {
    const session = await getServerSession(authOptions)
    const { id } = await params
    const issue = await fetchIssue(id)

    if (!issue) notFound()

    return (
        <Grid columns={{ initial: '1', sm: '5' }} gap="5">
            <Box className="md:col-span-4">
                <IssueDetails issue={issue} />
            </Box>
            {session && (
                <Box>
                    <Flex direction="column" gap="4">
                        <AssigneeSelect
                            issueId={issue.id}
                            assignedToUserId={issue.assignedToUserId}
                        />
                        <EditIssueButton issueId={id} />
                        <DeleteIssueButton issueId={id} />
                    </Flex>
                </Box>
            )}
        </Grid>
    )
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params
    const issue = await fetchIssue(id)

    return {
        title: 'Edit Issue - ' + issue.title,
        description: issue.description,
    }
}

export default IssueDetailsPage
