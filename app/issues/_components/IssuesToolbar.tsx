'use client'

import { Button, Container, Flex } from '@radix-ui/themes'
import Link from 'next/link'
import IssueStatusFilter from './IssueStatusFilter'
import UserFilter from './UserFilter'

interface Props {
    loading?: boolean
    currStatus?: string
    currUserId?: string
}

const IssuesToolbar: React.FC<Props> = ({
    currStatus,
    currUserId,
    loading = false,
}: Props) => {
    return (
        <Container className="my-3">
            <Flex justify="between" align="end">
                <IssueStatusFilter currStatus={currStatus} />
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
