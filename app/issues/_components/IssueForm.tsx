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

// Create a promise that resolves when SimpleMDE is loaded
let simpleMDELoadedPromise: Promise<void> | null = null

const getSimpleMDELoadedPromise = () => {
    if (!simpleMDELoadedPromise) {
        simpleMDELoadedPromise = import("react-simplemde-editor").then(() => {})
    }
    return simpleMDELoadedPromise
}

// Component that waits for SimpleMDE to load
const TextFieldWithLoading = ({ ...props }: any) => {
    const [isLoaded, setIsLoaded] = useState(false)
    
    useEffect(() => {
        getSimpleMDELoadedPromise().then(() => setIsLoaded(true))
    }, [])
    
    if (!isLoaded) {
        return <Skeleton minHeight="40px" className="w-full" />
    }
    
    return <TextField.Root {...props} />
}

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => 	
    <Flex direction="column" gap="3">
    <Text>
        <Skeleton minHeight="200px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
            felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
            erat, fringilla sed commodo sed, aliquet nec magna.
        </Skeleton>
    </Text>
    <Text>
        <Skeleton minHeight="200px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
            felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
            erat, fringilla sed commodo sed, aliquet nec magna.
        </Skeleton>
    </Text>    
    </Flex>
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
           await axios.post('/api/issues', data)
           router.push('/issues') 
        } catch (apiError) {
            setIsSubmitting(false)
            setApiError('An unexpected error occurred.')
        }
    }

    const handleCancelClick = () => {
        router.push('/issues')
    }

    return (
        <div className='max-w-xl'>
        {apiError && 	
            <Callout.Root color="red" className='mb-5'>
                <Callout.Icon>
                    <BsExclamationTriangle />
                </Callout.Icon>
                <Callout.Text>
                    {apiError}
                </Callout.Text>
            </Callout.Root>}
        <form className='max-w-xl space-y-3' onSubmit={handleSubmit(onSubmit)}>
        
        <TextFieldWithLoading placeholder='Title' defaultValue={issue?.title} {...register("title")} />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        
        <div>
            <Controller 
                name="description"
                control={control}
                defaultValue={issue?.description || ''}
                render={({field}) => 
                <>
                    <SimpleMDE id={field.name} placeholder='Description' value={field.value} onChange={field.onChange} />
                    <ErrorMessage>{errors.description?.message}</ErrorMessage>
                </>}
                />        
        </div>
         <div className='text-right space-x-3'>
            <Button type="submit" disabled={isSubmitting} className='px-5 mr-5'>Create Issue {isSubmitting && <Spinner />}</Button> &nbsp;
            <Button onClick={handleCancelClick}>Cancel</Button>
         </div>    
         </form>
         </div>
  )
}

export default IssueForm