'use client'
import ErrorMessage from '@/app/components/ErrorMessage'
import { Issue } from '@/app/generated/prisma'
import {
    CREATE_ISSUE_MUTATION,
    UPDATE_ISSUE_MUTATION,
} from '@/app/graphql/queries'
import { client as graphqlClient } from '@/app/lib/graphql-client'
import { issueSchema } from '@/app/schemas/validationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Callout, Select, Spinner, TextField } from '@radix-ui/themes'
import 'easymde/dist/easymde.min.css'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BsExclamationTriangle } from 'react-icons/bs'
import { z } from 'zod'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
})

type IssueFormData = z.infer<typeof issueSchema>

interface Props {
    issue?: Issue
}

const IssueForm: React.FC<Props> = ({ issue }: Props) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IssueFormData>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            issueType: issue?.issueType || 'GENERAL',
        },
    })
    const router = useRouter()
    const [apiError, setApiError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit: SubmitHandler<IssueFormData> = async (data) => {
        try {
            setIsSubmitting(true)
            if (issue) {
                await graphqlClient.mutate({
                    mutation: UPDATE_ISSUE_MUTATION,
                    variables: {
                        id: issue.id.toString(),
                        input: data,
                    },
                })
            } else {
                await graphqlClient.mutate({
                    mutation: CREATE_ISSUE_MUTATION,
                    variables: {
                        input: data,
                    },
                })
            }
            router.push('/issues/list')
            router.refresh()
        } catch (apiError) {
            setIsSubmitting(false)
            setApiError('An unexpected error occurred.')
        }
    }

    const handleCancelClick = () => {
        router.push('/issues/list')
    }

    return (
        <div className="max-w-full">
            {apiError && (
                <Callout.Root color="red" className="mb-5">
                    <Callout.Icon>
                        <BsExclamationTriangle />
                    </Callout.Icon>
                    <Callout.Text>{apiError}</Callout.Text>
                </Callout.Root>
            )}
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <TextField.Root
                    placeholder="Title"
                    defaultValue={issue?.title}
                    {...register('title')}
                />
                <ErrorMessage>{errors.title?.message}</ErrorMessage>

                <div>
                    <Controller
                        name="issueType"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Select.Root
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <Select.Trigger placeholder="Select Issue Type" />
                                    <Select.Content>
                                        <Select.Item value="GENERAL">
                                            General
                                        </Select.Item>
                                        <Select.Item value="BUG">
                                            Bug
                                        </Select.Item>
                                        <Select.Item value="SPIKE">
                                            Spike
                                        </Select.Item>
                                        <Select.Item value="TASK">
                                            Task
                                        </Select.Item>
                                        <Select.Item value="SUBTASK">
                                            Subtask
                                        </Select.Item>
                                    </Select.Content>
                                </Select.Root>
                                <ErrorMessage>
                                    {errors.issueType?.message}
                                </ErrorMessage>
                            </>
                        )}
                    />
                </div>

                <div>
                    <Controller
                        name="description"
                        control={control}
                        defaultValue={issue?.description || ''}
                        render={({ field }) => (
                            <>
                                <SimpleMDE
                                    placeholder="Description"
                                    {...field}
                                />
                                <ErrorMessage>
                                    {errors.description?.message}
                                </ErrorMessage>
                            </>
                        )}
                    />
                </div>
                <div className="text-right space-x-3">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 mr-5"
                    >
                        {issue ? 'Update' : 'Create'} Issue{' '}
                        {isSubmitting && <Spinner />}
                    </Button>{' '}
                    &nbsp;
                    <Button type="button" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default IssueForm
