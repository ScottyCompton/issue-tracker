import SignInPage from '@/app/signin/page'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Mock next-auth
vi.mock('next-auth/react', () => ({
    useSession: vi.fn(() => ({
        data: null,
        status: 'unauthenticated',
    })),
    signIn: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}))

describe('SignInPage', () => {
    it('renders sign-in page for unauthenticated users', () => {
        render(<SignInPage />)

        expect(screen.getByText('Welcome to Issue Tracker')).toBeInTheDocument()
        expect(
            screen.getByText('Sign in to manage your issues and track progress')
        ).toBeInTheDocument()
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument()
        expect(
            screen.getByText(
                'By signing in, you agree to our terms of service and privacy policy'
            )
        ).toBeInTheDocument()
    })

    it('renders sign-in form with Google button', () => {
        render(<SignInPage />)

        // Check that the Google sign-in button is present
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument()

        // The Google logo should be present
        expect(document.querySelector('svg')).toBeInTheDocument()
    })

    it('has proper height for main layout', () => {
        render(<SignInPage />)

        const mainContainer = document.querySelector(
            '.h-\\[calc\\(100vh-120px\\)\\]'
        )
        expect(mainContainer).toBeInTheDocument()
    })
})
