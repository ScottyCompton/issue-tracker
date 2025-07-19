'use client'
import { Flex, Skeleton, Text } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import React from 'react'


interface Props {
    name: string,
    value: string,
    onChange: ((value: string, changeObject?: CodeMirror.EditorChange) => void) | undefined
}

const MdeEditor = ({name, value, onChange}: Props) => {
    const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
        ssr: false,
       })    
  return (
    <SimpleMDE id={name} placeholder='Description' value={value} onChange={onChange} />
  )
}

export default MdeEditor