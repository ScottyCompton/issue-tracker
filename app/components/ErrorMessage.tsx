import React from 'react'
import { Text } from '@radix-ui/themes'

interface ErrorMessageProps {
  children?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }: ErrorMessageProps) => {
  if (!children) return null
  return (
    <Text color="red" as="p">{children}</Text>
  )
}

export default ErrorMessage