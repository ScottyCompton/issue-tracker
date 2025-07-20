'use client'
import { TextField, Button, Skeleton, Flex, Text, Callout, Spinner } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css";
import { Suspense, useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import axios from "axios"
import { useRouter } from 'next/navigation';
import { BsExclamationTriangle } from 'react-icons/bs';
import { zodResolver } from '@hookform/resolvers/zod'
import { issueSchema } from '@/app/schemas/validationSchemas';
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage';
import { Issue } from '@/app/generated/prisma';

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
})

type IssueFormData = z.infer<typeof issueSchema>

interface Props {
    issue?: Issue
}

const IssueForm:React.FC<Props> = ({issue}: Props) => {
    const { register, control, handleSubmit,  formState: { errors } } = useForm<IssueFormData>({
        resolver: zodResolver(issueSchema)
    });
    const router = useRouter()
    const [apiError, setApiError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit:SubmitHandler<IssueFormData> = async (data) => {
        try {
           setIsSubmitting(true)
           if(issue) {
            await axios.patch(`/api/issues/${issue.id}`, data)
           } else {
            await axios.post('/api/issues', data)
        }
        router.push('/issues')
        router.refresh()
    } catch (apiError) {
            setIsSubmitting(false)
            setApiError('An unexpected error occurred.')
        }
    }

    const handleCancelClick = () => {
        router.push('/issues')
    }

    return (
        <div className='max-w-full'>
        {apiError && 	
            <Callout.Root color="red" className='mb-5'>
                <Callout.Icon>
                    <BsExclamationTriangle />
                </Callout.Icon>
                <Callout.Text>
                    {apiError}
                </Callout.Text>
            </Callout.Root>}
        <form className='space-y-3' onSubmit={handleSubmit(onSubmit)}>
        
        <TextField.Root placeholder='Title' defaultValue={issue?.title} {...register("title")} />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        
        <div>
            <Controller 
                name="description"
                control={control}
                defaultValue={issue?.description || ''}
                render={({field}) => 
                <>
                    <SimpleMDE placeholder='Description' {...field} />
                    <ErrorMessage>{errors.description?.message}</ErrorMessage>
                </>}
                />        
        </div>
         <div className='text-right space-x-3'>
            <Button type="submit" disabled={isSubmitting} className='px-5 mr-5'>{issue ? 'Update' : 'Create'} Issue {isSubmitting && <Spinner />}</Button> &nbsp;
            <Button onClick={handleCancelClick}>Cancel</Button>
         </div>    
         </form>
         </div>
  )
}

export default IssueForm