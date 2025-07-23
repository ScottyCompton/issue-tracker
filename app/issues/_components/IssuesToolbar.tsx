'use client'

import { Button, Container, Flex } from '@radix-ui/themes'
import Link from 'next/link'
import IssueStatusFilter from './IssueStatusFilter'


interface Props {
  loading?: boolean
  currStatus?: string
}

const IssuesToolbar:React.FC<Props> = ({currStatus, loading = false}: Props) => {


  return (
    <Container className="my-3">
    <Flex justify="between">
      <IssueStatusFilter currStatus={currStatus} />
      <Button disabled={loading}><Link href='/issues/new/'>Create Issue</Link></Button>
    </Flex>
    </Container>
)
}

export default IssuesToolbar