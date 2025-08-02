'use client'

import { Button, Container, Flex } from '@radix-ui/themes'
import Link from 'next/link'
import IssueStatusFilter from './IssueStatusFilter'
import IssueTypeFilter from './IssueTypeFilter'
import UserFilter from './UserFilter'

interface Props {
    loading?: boolean
    currStatus?: string
    currIssueType?: string
    currUserId?: string
}

const IssuesToolbar: React.FC<Props> = ({
    currStatus,
    currIssueType,
    currUserId,
    loading = false,
}: Props) => {
    return (
        <Container className="my-3">
            <Flex justify="between" align="end">
                <Flex gap="3" align="end">
                    <IssueStatusFilter currStatus={currStatus} />
                    <IssueTypeFilter currIssueType={currIssueType} />
                </Flex>
                <Flex gap="5" align="end">
                    <UserFilter currUserId={currUserId} />
                    <Button disabled={loading}>
                        <Link href="/issues/new/">Create Issue</Link>
                    </Button>
                </Flex>
            </Flex>
        </Container>
    )
}

export default IssuesToolbar
