import Navbar from '@/app/components/Navbar'
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

describe('Navbar', () => {
    beforeEach(() => {
        mockUsePathname.mockReturnValue('/')
        mockUseSession.mockReturnValue({
            status: 'unauthenticated',
            data: null,
        })
    })

    it('renders navbar with logo and navigation links', () => {
        render(<Navbar />)

        // Check if logo link is rendered
        const logoLink = screen.getByRole('link', { name: '' })
        expect(logoLink).toBeInTheDocument()
        expect(logoLink).toHaveAttribute('href', '/')

        // Check if navigation links are rendered
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Issues')).toBeInTheDocument()
    })

    it('highlights active link based on current path', () => {
        mockUsePathname.mockReturnValue('/issues/list')
        render(<Navbar />)

        const issuesLink = screen.getByText('Issues')
        const dashboardLink = screen.getByText('Dashboard')

        expect(issuesLink).toHaveClass('text-zink-900')
        expect(dashboardLink).toHaveClass('text-zinc-500')
    })

    it('shows login link when user is unauthenticated', () => {
        mockUseSession.mockReturnValue({
            status: 'unauthenticated',
            data: null,
        })

        render(<Navbar />)

        const loginLink = screen.getByText('Login')
        expect(loginLink).toBeInTheDocument()
        expect(loginLink).toHaveAttribute('href', '/api/auth/signin')
    })

    it('shows loading skeleton when session is loading', () => {
        mockUseSession.mockReturnValue({
            status: 'loading',
            data: null,
        })

        render(<Navbar />)

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

        render(<Navbar />)

        // Check for the avatar element by class
        const avatar = document.querySelector('.rt-AvatarRoot')
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

        render(<Navbar />)

        // Check for the avatar root element
        const avatarRoot = document.querySelector('.rt-AvatarRoot')
        expect(avatarRoot).toBeInTheDocument()
    })

    it('navigates to dashboard when logo is clicked', () => {
        render(<Navbar />)

        const logoLink = screen.getByRole('link', { name: '' })
        expect(logoLink).toHaveAttribute('href', '/')
    })

    it('navigates to issues list when issues link is clicked', () => {
        render(<Navbar />)

        const issuesLink = screen.getByText('Issues')
        expect(issuesLink).toHaveAttribute('href', '/issues/list')
    })

    it('navigates to dashboard when dashboard link is clicked', () => {
        render(<Navbar />)

        const dashboardLink = screen.getByText('Dashboard')
        expect(dashboardLink).toHaveAttribute('href', '/')
    })

    it('applies hover styles to navigation links', () => {
        render(<Navbar />)

        const dashboardLink = screen.getByText('Dashboard')
        const issuesLink = screen.getByText('Issues')

        expect(dashboardLink).toHaveClass(
            'hover:text-zinc-800',
            'transition-colors'
        )
        expect(issuesLink).toHaveClass(
            'hover:text-zinc-800',
            'transition-colors'
        )
    })

    it('renders with correct container structure', () => {
        const { container } = render(<Navbar />)

        const nav = container.querySelector('nav')
        expect(nav).toBeInTheDocument()
        expect(nav).toHaveClass('border-b', 'p-6')
    })

    it('handles different authentication states correctly', () => {
        const testCases = [
            {
                status: 'loading',
                expectedElements: ['.react-loading-skeleton'],
                notExpectedElements: ['Login', 'Sign Out'],
            },
            {
                status: 'unauthenticated',
                expectedElements: ['Login'],
                notExpectedElements: ['Sign Out', '.react-loading-skeleton'],
            },
            {
                status: 'authenticated',
                expectedElements: ['.rt-AvatarRoot'],
                notExpectedElements: ['Login', '.react-loading-skeleton'],
            },
        ]

        testCases.forEach(
            ({ status, expectedElements, notExpectedElements }) => {
                mockUseSession.mockReturnValue({
                    status,
                    data:
                        status === 'authenticated'
                            ? {
                                  user: {
                                      email: 'test@example.com',
                                      image: null,
                                  },
                              }
                            : null,
                })

                const { unmount } = render(<Navbar />)

                expectedElements.forEach((element) => {
                    if (element.startsWith('.')) {
                        // CSS class selector
                        const foundElement = document.querySelector(element)
                        expect(foundElement).toBeInTheDocument()
                    } else {
                        expect(screen.getByText(element)).toBeInTheDocument()
                    }
                })

                notExpectedElements.forEach((element) => {
                    if (element.startsWith('.')) {
                        // CSS class selector
                        const foundElement = document.querySelector(element)
                        expect(foundElement).not.toBeInTheDocument()
                    } else {
                        expect(
                            screen.queryByText(element)
                        ).not.toBeInTheDocument()
                    }
                })

                unmount()
            }
        )
    })
})
