'use client'
import { TextField, Button } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; // Import the CSS for the editor
import { useState } from 'react';

const NewIssue = () => {
    const [markdown, setMarkdown] = useState('');

    const handleChange = (value:any) => {
      setMarkdown(value);
    };    
  return (
    <div className='max-w-xl space-y-3'>
        <TextField.Root placeholder='Title' />
        <div>
            <SimpleMDE placeholder='Description' value={markdown} onChange={handleChange} />
         </div>    
        <Button>Create Issue</Button>
    </div>
  )
}

export default NewIssue