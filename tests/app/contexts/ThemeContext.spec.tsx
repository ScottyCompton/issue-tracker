import { ThemeProvider, useTheme } from '@/app/contexts/ThemeContext'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Test component to access theme context
const TestComponent = () => {
    const { theme, setTheme, resolvedTheme } = useTheme()
    return (
        <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="resolved-theme">{resolvedTheme}</div>
            <button onClick={() => setTheme('light')} data-testid="set-light">
                Light
            </button>
            <button onClick={() => setTheme('dark')} data-testid="set-dark">
                Dark
            </button>
            <button onClick={() => setTheme('system')} data-testid="set-system">
                System
            </button>
        </div>
    )
}

describe('ThemeContext', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue(null)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should provide default theme values', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        expect(screen.getByTestId('theme')).toHaveTextContent('system')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
    })

    it('should load theme from localStorage on mount', () => {
        localStorageMock.getItem.mockReturnValue('dark')

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
        expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })

    it('should save theme to localStorage when changed', async () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        const lightButton = screen.getByTestId('set-light')
        await act(async () => {
            lightButton.click()
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
        expect(screen.getByTestId('theme')).toHaveTextContent('light')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
    })

    it('should handle dark theme', async () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        const darkButton = screen.getByTestId('set-dark')
        await act(async () => {
            darkButton.click()
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
        expect(screen.getByTestId('theme')).toHaveTextContent('dark')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
    })

    it('should handle system theme', async () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        const systemButton = screen.getByTestId('set-system')
        await act(async () => {
            systemButton.click()
        })

        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'system')
        expect(screen.getByTestId('theme')).toHaveTextContent('system')
    })

    it('should detect system dark mode', () => {
        // Mock matchMedia to return dark mode
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

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        // System theme should resolve to dark when system is in dark mode
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
    })

    it('should throw error when used outside provider', () => {
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        expect(() => {
            render(<TestComponent />)
        }).toThrow('useTheme must be used within a ThemeProvider')

        consoleSpy.mockRestore()
    })
})
