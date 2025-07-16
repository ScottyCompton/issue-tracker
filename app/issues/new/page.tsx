'use client'
import { TextField, Button } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; // Import the CSS for the editor
import { SetStateAction, useState } from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import axios from "axios"
import { useRouter } from 'next/navigation';

interface IssueForm  {
    title: string,
    description: string
}


const NewIssue = () => {
    const { register, control, handleSubmit,  formState: { errors } } = useForm<IssueForm>();
    const router = useRouter()

    const onSubmit:SubmitHandler<IssueForm> = async (data) => {
       await axios.post('/api/issues', data)
       router.push('/issues')
    }

    return (
        <form className='max-w-xl space-y-3' onSubmit={handleSubmit(onSubmit)}>
        <TextField.Root placeholder='Title' {...register("title")} />
        <div>
            <Controller 
                name="description"
                control={control}
                render={({field}) => <SimpleMDE placeholder='Description' {...field} />}
                />
                
                
         </div>    
        <Button>Create Issue</Button>
        </form>
  )
}

export default NewIssue