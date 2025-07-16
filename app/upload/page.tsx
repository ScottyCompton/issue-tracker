'use client'
import React, { useState } from 'react'
import { CldUploadWidget, CldImage } from 'next-cloudinary'

interface CloudinaryResult {
    public_id: string
}

const UploadPage = () => {
    const [publicId, setPublicId] = useState<string | null>(null)
    const handleUpload = (result: any) => {
        if(result.event !== 'success') return

        const info = result.info as CloudinaryResult
        setPublicId(info.public_id)
    }
  return (
    <>
        {publicId && <CldImage src={publicId} alt='Uploaded Image' width={270} height={180} />}
        <CldUploadWidget 
            uploadPreset="cwmdevdemo1" 
            onSuccess={handleUpload}
            options={{
            sources: ['local'],
            maxFiles: 10,
            resourceType: 'image',
            multiple: true,
            styles: {
                width: '100%',
                height: '100%',
            }
        }}>{({ open }) => <button className='btn btn-primary' onClick={() => open()}>Upload</button>}</CldUploadWidget>
    </>
  )
}

export default UploadPage