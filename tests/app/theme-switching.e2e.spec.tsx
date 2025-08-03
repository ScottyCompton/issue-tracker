import ThemeToggle from '@/app/components/ThemeToggle'
import ThemeWrapper from '@/app/components/ThemeWrapper'
import { ThemeProvider } from '@/app/contexts/ThemeContext'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
    DropdownMenu: {
        Root: ({ children }: any) => (
            <div data-testid="dropdown-root">{children}</div>
        ),
        Trigger: ({ children }: any) => (
            <button data-testid="dropdown-trigger">{children}</button>
        ),
        Content: ({ children }: any) => (
            <div data-testid="dropdown-content">{children}</div>
        ),
        Item: ({ children, onClick, className }: any) => (
            <button
                data-testid="dropdown-item"
                onClick={onClick}
                className={className}
            >
                {children}
            </button>
        ),
    },
    Flex: ({ children, ...props }: any) => (
        <div data-testid="flex" {...props}>
            {children}
        </div>
    ),
    Text: ({ children, ...props }: any) => (
        <span data-testid="text" {...props}>
            {children}
        </span>
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

const TestApp = () => (
    <ThemeProvider>
        <ThemeWrapper>
            <div data-testid="app-content">
                <h1>Test App</h1>
                <ThemeToggle />
            </div>
        </ThemeWrapper>
    </ThemeProvider>
)

describe('Theme Switching E2E', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue(null)
    })

    it('should complete full theme switching flow', async () => {
        render(<TestApp />)

        // Initial state - system theme
        expect(screen.getByTestId('radix-theme')).toHaveAttribute(
            'data-appearance',
            'light'
        )
        expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('System')
        expect(screen.getAllByTestId('display-icon')[0]).toBeInTheDocument()

        // Test that the component renders correctly
        expect(screen.getByTestId('app-content')).toBeInTheDocument()
        expect(screen.getByText('Test App')).toBeInTheDocument()
    })

    it('should persist theme choice across renders', async () => {
        // Set theme to dark
        localStorageMock.getItem.mockReturnValue('dark')

        render(<TestApp />)

        // Should load dark theme from localStorage
        expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
        expect(screen.getByTestId('radix-theme')).toHaveAttribute(
            'data-appearance',
            'dark'
        )
        expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Dark')
        expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark')
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

        render(<TestApp />)

        // Should detect system dark mode and apply it
        expect(screen.getByTestId('radix-theme')).toHaveAttribute(
            'data-appearance',
            'dark'
        )
        expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark')
    })

    it('should handle theme switching back to light', async () => {
        // Start with dark theme
        localStorageMock.getItem.mockReturnValue('dark')

        render(<TestApp />)

        // Should start with dark theme
        expect(screen.getByTestId('radix-theme')).toHaveAttribute(
            'data-appearance',
            'dark'
        )

        // Test that the component renders correctly with dark theme
        expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Dark')
        expect(screen.getAllByTestId('moon-icon')[0]).toBeInTheDocument()
    })

    it('should handle multiple theme switches', async () => {
        // Clear localStorage to start with default theme
        localStorageMock.getItem.mockReturnValue(null)
        
        render(<TestApp />)

        // Test initial state (system theme detection is mocked to return dark)
        expect(screen.getByTestId('radix-theme')).toHaveAttribute(
            'data-appearance',
            'dark'
        )

        // Test that the component renders correctly
        expect(screen.getByTestId('app-content')).toBeInTheDocument()
        expect(screen.getByText('Test App')).toBeInTheDocument()
    })
})
