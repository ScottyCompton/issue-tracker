'use client'
import { TextField, Button, Skeleton, Flex, Text, Callout } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css";
import { useCallback, useState } from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import axios from "axios"
import { useRouter } from 'next/navigation';
import { BsExclamationTriangle } from 'react-icons/bs';
import { zodResolver } from '@hookform/resolvers/zod'
import { createIssueSchema } from '@/app/schemas/validationSchemas';
import { z } from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage';

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

type IssueForm = z.infer<typeof createIssueSchema>

const NewIssue:React.FC = () => {
    const { register, control, handleSubmit,  formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(createIssueSchema)
    });
    const router = useRouter()
    const [desc, setDesc] = useState('')
    const [error, setError] = useState('')


    const onSubmit:SubmitHandler<IssueForm> = async (data) => {
        try {
           await axios.post('/api/issues', data)
           router.push('/issues') 
        } catch (error) {
            setError('An unexpected error occurred.')
        }

    }

    const onChange = useCallback((value: string) => {
        setDesc(value);
      }, []);

    const handleCancelClick = () => {
        router.push('/issues')
    }

    return (
        <div className='max-w-xl'>
        {error && 	
            <Callout.Root color="red" className='mb-5'>
                <Callout.Icon>
                    <BsExclamationTriangle />
                </Callout.Icon>
                <Callout.Text>
                    {error}
                </Callout.Text>
            </Callout.Root>}
        <form className='max-w-xl space-y-3' onSubmit={handleSubmit(onSubmit)}>
        <TextField.Root placeholder='Title' {...register("title")} />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <div>
            <Controller 
                name="description"
                control={control}
                render={({field}) => <SimpleMDE id={field.name} placeholder='Description' value={desc} onChange={onChange} />}
                />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
         <div className='text-right space-x-3'>
            <Button className='px-5 mr-5'>Create Issue</Button> &nbsp;
            <Button onClick={handleCancelClick}>Cancel</Button>
         </div>    
         </form>
         </div>
  )
}

export default NewIssue