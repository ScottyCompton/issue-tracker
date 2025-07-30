'use client'
import React, { ReactElement } from 'react'
import { SessionProvider } from 'next-auth/react'

interface Props {
    children: ReactElement
}

const AuthProvider = ({ children }: Props) => {
    return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
