import Navbar from '@/app/components/Navbar'
import { ThemeProvider } from '@/app/contexts/ThemeContext'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock react-icons
vi.mock('react-icons/bs', () => ({
    BsBugFill: ({ size }: { size: number }) => (
        <div data-testid="bug-icon" data-size={size}>
            Bug
        </div>
    ),
    BsSun: ({ size }: { size: number }) => (
        <div data-testid="sun-icon" data-size={size}>
            Sun
        </div>
    ),
    BsMoon: ({ size }: { size: number }) => (
        <div data-testid="moon-icon" data-size={size}>
            Moon
        </div>
    ),
    BsDisplay: ({ size }: { size: number }) => (
        <div data-testid="display-icon" data-size={size}>
            Display
        </div>
    ),
}))

// Mock next-auth
vi.mock('next-auth/react', () => ({
    useSession: () => ({
        status: 'authenticated',
        data: {
            user: {
                email: 'test@example.com',
                image: 'https://example.com/avatar.jpg',
            },
        },
    }),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}))

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('Navbar with Theme Toggle', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue(null)
    })

    it('should render navbar with theme toggle', () => {
        renderWithTheme(<Navbar />)

        // Should have the bug icon (logo)
        expect(screen.getByTestId('bug-icon')).toBeInTheDocument()

        // Should have navigation links
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Issues')).toBeInTheDocument()

        // Should have theme toggle
        expect(screen.getByText('System')).toBeInTheDocument()
        expect(screen.getByTestId('display-icon')).toBeInTheDocument()

        // Should have auth status
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should position theme toggle next to auth status', () => {
        renderWithTheme(<Navbar />)

        const navbar = screen.getByRole('navigation')
        const themeToggle = screen.getByText('System')
        const authStatus = screen.getByText('test@example.com')

        // Both should be in the right side of the navbar
        expect(navbar).toContainElement(themeToggle)
        expect(navbar).toContainElement(authStatus)
    })

    it('should open theme dropdown when theme toggle is clicked', async () => {
        renderWithTheme(<Navbar />)

        const themeToggle = screen.getByText('System')
        fireEvent.click(themeToggle)

        await waitFor(() => {
            expect(screen.getByText('Light')).toBeInTheDocument()
            expect(screen.getByText('Dark')).toBeInTheDocument()
            expect(screen.getByText('System')).toBeInTheDocument()
        })
    })

    it('should switch themes when theme options are clicked', async () => {
        renderWithTheme(<Navbar />)

        const themeToggle = screen.getByText('System')
        fireEvent.click(themeToggle)

        await waitFor(() => {
            const lightOption = screen.getByText('Light')
            fireEvent.click(lightOption)
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
    })

    it('should show correct theme icon based on current theme', () => {
        localStorageMock.getItem.mockReturnValue('dark')
        renderWithTheme(<Navbar />)

        expect(screen.getByText('Dark')).toBeInTheDocument()
        expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    })

    it('should maintain navbar layout with theme toggle', () => {
        renderWithTheme(<Navbar />)

        // Should have proper flex layout
        const navbar = screen.getByRole('navigation')
        expect(navbar).toBeInTheDocument()

        // Should have container structure
        const container = navbar.querySelector('[class*="container"]')
        expect(container).toBeInTheDocument()
    })

    it('should have proper spacing between theme toggle and auth status', () => {
        renderWithTheme(<Navbar />)

        const themeToggle = screen.getByText('System')
        const authStatus = screen.getByText('test@example.com')

        // Both should be in a flex container with gap
        const flexContainer = themeToggle.closest('[class*="flex"]')
        expect(flexContainer).toHaveClass('gap-3')
    })

    it('should handle theme toggle interactions without affecting other navbar elements', async () => {
        renderWithTheme(<Navbar />)

        // Click theme toggle
        const themeToggle = screen.getByText('System')
        fireEvent.click(themeToggle)

        await waitFor(() => {
            const lightOption = screen.getByText('Light')
            fireEvent.click(lightOption)
        })

        // Other navbar elements should still be present
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Issues')).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
})
