import ThemeToggle from '@/app/components/ThemeToggle'
import { ThemeProvider } from '@/app/contexts/ThemeContext'
import { Theme } from '@radix-ui/themes'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock react-icons
vi.mock('react-icons/bs', () => ({
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
    return render(
        <ThemeProvider>
            <Theme appearance="light">{component}</Theme>
        </ThemeProvider>
    )
}

describe('ThemeToggle', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue(null)
    })

    it('should render with default system theme', () => {
        renderWithTheme(<ThemeToggle />)

        // Should show system theme by default
        expect(screen.getByText('System')).toBeInTheDocument()
        expect(screen.getByTestId('display-icon')).toBeInTheDocument()
    })

    it('should render with light theme when set', () => {
        localStorageMock.getItem.mockReturnValue('light')
        renderWithTheme(<ThemeToggle />)

        expect(screen.getByText('Light')).toBeInTheDocument()
        expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    })

    it('should render with dark theme when set', () => {
        localStorageMock.getItem.mockReturnValue('dark')
        renderWithTheme(<ThemeToggle />)

        expect(screen.getByText('Dark')).toBeInTheDocument()
        expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    })

    it('should have correct icon sizes', () => {
        renderWithTheme(<ThemeToggle />)

        // Main trigger icon should be size 16
        expect(screen.getByTestId('display-icon')).toHaveAttribute(
            'data-size',
            '16'
        )
    })

    it('should have proper hover styles', () => {
        renderWithTheme(<ThemeToggle />)

        const trigger = screen.getByText('System').closest('[type="button"]')
        expect(trigger).toHaveClass(
            'hover:bg-zinc-100',
            'dark:hover:bg-zinc-800',
            'transition-colors'
        )
    })

    it('should have proper layout structure', () => {
        renderWithTheme(<ThemeToggle />)

        // Should have flex container
        const flexContainer = screen
            .getByText('System')
            .closest('[class*="rt-Flex"]')
        expect(flexContainer).toBeInTheDocument()

        // Should have icon and text
        expect(screen.getByTestId('display-icon')).toBeInTheDocument()
        expect(screen.getByText('System')).toBeInTheDocument()
    })

    it('should be accessible', () => {
        renderWithTheme(<ThemeToggle />)

        const trigger = screen.getByText('System').closest('[type="button"]')
        expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('should have proper styling classes', () => {
        renderWithTheme(<ThemeToggle />)

        const trigger = screen.getByText('System').closest('[type="button"]')
        expect(trigger).toHaveClass(
            'px-3',
            'py-2',
            'rounded-md',
            'cursor-pointer'
        )
    })
})
