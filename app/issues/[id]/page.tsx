import { IssueStatusBadge } from '@/app/components'
import prisma from '@/prisma/client'
import { Box, Button, Card, Flex, Grid, Heading } from '@radix-ui/themes'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'

interface Props {
    params: Promise<{
        id: string
    }>
}


const IssueDetailsPage:React.FC<Props> = async ({params}: Props) => {
    const {id} = await params

    const issue = await prisma.issue.findUnique({
        where: {id: parseInt(id)}
    })

    if(!issue) notFound()
  return (
    <Grid columns={{initial: "1", md: "2"}} gap="5">
        <Box>
        <Heading>{issue.title}</Heading>
        <Flex className='space-x-3' my="2">
            <p><IssueStatusBadge status={issue.status} /></p>
            <p>{issue.createdAt.toDateString()}</p>
        </Flex>
        <Card mt="4">
            <span className='prose'>
                <ReactMarkdown>{issue.description}</ReactMarkdown>
            </span>
        </Card>
        </Box>
        <Box>
            <Button><Pencil2Icon /><Link href={`/issues/${id}/edit`}>Edit Issue</Link></Button>
        </Box>
    </Grid>
  )
}

export default IssueDetailsPage