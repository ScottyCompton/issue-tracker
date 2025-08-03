'use client'

import { Theme } from '@radix-ui/themes'
import { useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface ThemeWrapperProps {
    children: React.ReactNode
}

const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        // Apply dark mode class to document for Tailwind CSS
        if (resolvedTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [resolvedTheme])

    return (
        <Theme appearance={resolvedTheme} accentColor="blue" grayColor="slate">
            {children}
        </Theme>
    )
}

export default ThemeWrapper
