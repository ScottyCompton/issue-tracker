import Navbar from '@/app/components/Navbar'
import { ThemeProvider } from '@/app/contexts/ThemeContext'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '../../utils/test-utils'

// Mock Next.js navigation
const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
    default: ({ children, href, className }: any) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
}))

// Mock NextAuth
const mockUseSession = vi.fn()
vi.mock('next-auth/react', () => ({
    useSession: () => mockUseSession(),
}))

// Mock react-icons
vi.mock('react-icons/bs', () => ({
    BsBugFill: ({ size }: { size: number }) => <div data-testid="bug-icon" data-size={size}>Bug</div>,
    BsSun: ({ size }: { size: number }) => <div data-testid="sun-icon" data-size={size}>Sun</div>,
    BsMoon: ({ size }: { size: number }) => <div data-testid="moon-icon" data-size={size}>Moon</div>,
    BsDisplay: ({ size }: { size: number }) => <div data-testid="display-icon" data-size={size}>Display</div>,
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
            {component}
        </ThemeProvider>
    )
}

describe('Navbar', () => {
    beforeEach(() => {
        mockUsePathname.mockReturnValue('/')
        mockUseSession.mockReturnValue({
            status: 'unauthenticated',
            data: null,
        })
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue(null)
    })

    it('renders navbar with logo and navigation links', () => {
        renderWithTheme(<Navbar />)

        // Check if logo link is rendered
        const logoLink = screen.getByRole('link', { name: 'Bug' })
        expect(logoLink).toBeInTheDocument()
        expect(logoLink).toHaveAttribute('href', '/')

        // Check if navigation links are rendered
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Issues')).toBeInTheDocument()
    })

    it('highlights active link based on current path', () => {
        mockUsePathname.mockReturnValue('/issues/list')
        renderWithTheme(<Navbar />)

        const issuesLink = screen.getByText('Issues')
        const dashboardLink = screen.getByText('Dashboard')

        // When on issues page, issues link should be active and dashboard should be inactive
        expect(issuesLink).toHaveClass('text-zinc-900', 'font-medium')
        expect(dashboardLink).toHaveClass('text-zinc-500')
    })

    it('shows login link when user is unauthenticated', () => {
        mockUseSession.mockReturnValue({
            status: 'unauthenticated',
            data: null,
        })

        renderWithTheme(<Navbar />)

        const loginLink = screen.getByText('Login')
        expect(loginLink).toBeInTheDocument()
        expect(loginLink).toHaveAttribute('href', '/signin')
    })

    it('shows loading skeleton when session is loading', () => {
        mockUseSession.mockReturnValue({
            status: 'loading',
            data: null,
        })

        renderWithTheme(<Navbar />)

        // Check for the skeleton element by class
        const skeleton = document.querySelector('.react-loading-skeleton')
        expect(skeleton).toBeInTheDocument()
    })

    it('shows user avatar when authenticated', () => {
        const mockSession = {
            user: {
                email: 'test@example.com',
                image: 'https://example.com/avatar.jpg',
            },
        }

        mockUseSession.mockReturnValue({
            status: 'authenticated',
            data: mockSession,
        })

        renderWithTheme(<Navbar />)

        // Check for the avatar element by class
        const avatar = document.querySelector('[class*="Avatar"]')
        expect(avatar).toBeInTheDocument()
    })

    it('shows fallback avatar when user has no image', () => {
        const mockSession = {
            user: {
                email: 'test@example.com',
                image: null,
            },
        }

        mockUseSession.mockReturnValue({
            status: 'authenticated',
            data: mockSession,
        })

        renderWithTheme(<Navbar />)

        // Check for the avatar element by class
        const avatar = document.querySelector('[class*="Avatar"]')
        expect(avatar).toBeInTheDocument()
    })

    it('navigates to dashboard when logo is clicked', () => {
        renderWithTheme(<Navbar />)

        const logoLink = screen.getByRole('link', { name: 'Bug' })
        expect(logoLink).toHaveAttribute('href', '/')
    })

    it('navigates to issues list when issues link is clicked', () => {
        renderWithTheme(<Navbar />)

        const issuesLink = screen.getByText('Issues')
        expect(issuesLink).toHaveAttribute('href', '/issues/list')
    })

    it('navigates to dashboard when dashboard link is clicked', () => {
        renderWithTheme(<Navbar />)

        const dashboardLink = screen.getByText('Dashboard')
        expect(dashboardLink).toHaveAttribute('href', '/')
    })

    it('applies hover styles to navigation links', () => {
        renderWithTheme(<Navbar />)

        const dashboardLink = screen.getByText('Dashboard')
        const issuesLink = screen.getByText('Issues')

        // Check for base classes that are always present
        expect(dashboardLink).toHaveClass('px-3', 'py-2', 'rounded-md', 'transition-colors')
        expect(issuesLink).toHaveClass('px-3', 'py-2', 'rounded-md', 'transition-colors')
    })

    it('renders with correct container structure', () => {
        renderWithTheme(<Navbar />)

        const navbar = screen.getByRole('navigation')
        expect(navbar).toBeInTheDocument()

        // Check for Radix UI container structure
        const container = navbar.querySelector('[class*="rt-Container"]')
        expect(container).toBeInTheDocument()
    })

    it('handles different authentication states correctly', () => {
        // Test unauthenticated state
        mockUseSession.mockReturnValue({
            status: 'unauthenticated',
            data: null,
        })

        const { rerender } = renderWithTheme(<Navbar />)
        expect(screen.getByText('Login')).toBeInTheDocument()

        // Test authenticated state
        mockUseSession.mockReturnValue({
            status: 'authenticated',
            data: {
                user: {
                    email: 'test@example.com',
                    image: 'https://example.com/avatar.jpg',
                },
            },
        })

        rerender(
            <ThemeProvider>
                <Navbar />
            </ThemeProvider>
        )

        expect(screen.queryByText('Login')).not.toBeInTheDocument()
        const avatar = document.querySelector('[class*="Avatar"]')
        expect(avatar).toBeInTheDocument()
    })
})
