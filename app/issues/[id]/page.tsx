import prisma from '@/prisma/client'
import { Box, Grid } from '@radix-ui/themes'
import { notFound } from 'next/navigation'
import EditIssueButton from './EditIssueButton'
import IssueDetails from './IssueDetails'

interface Props {
    params: Promise<{
        id: string
    }>
}

const IssueDetailsPage: React.FC<Props> = async ({ params }: Props) => {
    const { id } = await params

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) },
    })

    if (!issue) notFound()
    return (
        <Grid columns={{ initial: '1', md: '2' }} gap="5">
            <Box>
                <IssueDetails issue={issue} />
            </Box>
            <Box>
                <EditIssueButton issueId={id} />
            </Box>
        </Grid>
    )
}

export default IssueDetailsPage
