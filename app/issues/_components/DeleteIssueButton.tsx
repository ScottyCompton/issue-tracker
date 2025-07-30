'use client'
import { Spinner } from '@/app/components'
import { DELETE_ISSUE_MUTATION } from '@/app/graphql/queries'
import { client as graphqlClient } from '@/app/lib/graphql-client'
import { AlertDialog, Button, Callout, Flex } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BsExclamationTriangle } from 'react-icons/bs'

interface Props {
    issueId: string
}

const DeleteIssueButton: React.FC<Props> = ({ issueId }: Props) => {
    const [apiError, setApiError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const router = useRouter()

    const doDelete = async () => {
        try {
            setIsDeleting(true)
            await graphqlClient.mutate({
                mutation: DELETE_ISSUE_MUTATION,
                variables: { id: issueId },
            })
            router.push('/issues/list')
            router.refresh()
        } catch (apiError) {
            setIsDeleting(false)
            setApiError('An unexpected error occurred.')
        }
    }

    return (
        <>
            {apiError && (
                <Callout.Root color="red" className="mb-5">
                    <Callout.Icon>
                        <BsExclamationTriangle />
                    </Callout.Icon>
                    <Callout.Text>{apiError}</Callout.Text>
                </Callout.Root>
            )}

            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    <Button color="red" disabled={isDeleting}>
                        Delete Issue {isDeleting && <Spinner />}
                    </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>Delete Issue</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        Are you sure? This action cannot be undone.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button
                                variant="solid"
                                color="red"
                                onClick={doDelete}
                            >
                                Delete Issue
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    )
}

export default DeleteIssueButton
