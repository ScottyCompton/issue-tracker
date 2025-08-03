import ThemeWrapper from '@/app/components/ThemeWrapper'
import { ThemeProvider } from '@/app/contexts/ThemeContext'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Radix UI Theme component
vi.mock('@radix-ui/themes', () => ({
    Theme: ({ children, appearance, accentColor, grayColor }: any) => (
        <div
            data-testid="radix-theme"
            data-appearance={appearance}
            data-accent-color={accentColor}
            data-gray-color={grayColor}
        >
            {children}
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

// Mock document.documentElement
const mockDocumentElement = {
    classList: {
        add: vi.fn(),
        remove: vi.fn(),
    },
}
Object.defineProperty(document, 'documentElement', {
    value: mockDocumentElement,
    writable: true,
})

const TestChild = () => <div data-testid="test-child">Test Content</div>

const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ThemeWrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue(null)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should render children', () => {
        renderWithTheme(
            <ThemeWrapper>
                <TestChild />
            </ThemeWrapper>
        )

        expect(screen.getByTestId('test-child')).toBeInTheDocument()
        expect(screen.getByTestId('radix-theme')).toBeInTheDocument()
    })

    it('should apply light theme by default', () => {
        renderWithTheme(
            <ThemeWrapper>
                <TestChild />
            </ThemeWrapper>
        )

        const themeElement = screen.getByTestId('radix-theme')
        expect(themeElement).toHaveAttribute('data-appearance', 'light')
        expect(themeElement).toHaveAttribute('data-accent-color', 'blue')
        expect(themeElement).toHaveAttribute('data-gray-color', 'slate')
    })

    it('should apply dark theme when resolved theme is dark', () => {
        localStorageMock.getItem.mockReturnValue('dark')

        renderWithTheme(
            <ThemeWrapper>
                <TestChild />
            </ThemeWrapper>
        )

        const themeElement = screen.getByTestId('radix-theme')
        expect(themeElement).toHaveAttribute('data-appearance', 'dark')
    })

    it('should add dark class to document when theme is dark', () => {
        localStorageMock.getItem.mockReturnValue('dark')

        renderWithTheme(
            <ThemeWrapper>
                <TestChild />
            </ThemeWrapper>
        )

        expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark')
    })

    it('should remove dark class from document when theme is light', () => {
        localStorageMock.getItem.mockReturnValue('light')

        renderWithTheme(
            <ThemeWrapper>
                <TestChild />
            </ThemeWrapper>
        )

        expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
            'dark'
        )
    })

    it('should handle system theme detection', () => {
        // Mock system dark mode
        const mockMatchMedia = vi.fn().mockImplementation((query) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: mockMatchMedia,
        })

        renderWithTheme(
            <ThemeWrapper>
                <TestChild />
            </ThemeWrapper>
        )

        // Should apply dark theme when system is in dark mode
        const themeElement = screen.getByTestId('radix-theme')
        expect(themeElement).toHaveAttribute('data-appearance', 'dark')
        expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark')
    })

    it('should have correct Radix UI theme props', () => {
        renderWithTheme(
            <ThemeWrapper>
                <TestChild />
            </ThemeWrapper>
        )

        const themeElement = screen.getByTestId('radix-theme')
        expect(themeElement).toHaveAttribute('data-accent-color', 'blue')
        expect(themeElement).toHaveAttribute('data-gray-color', 'slate')
    })
})
