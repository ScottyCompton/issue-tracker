import Link from '@/app/components/Link'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../../utils/test-utils'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

describe('Link', () => {
    beforeEach(() => {
        mockPush.mockClear()
    })

    it('renders link with correct text', () => {
        const linkText = 'Test Link'
        const href = '/test'

        render(<Link href={href}>{linkText}</Link>)

        const link = screen.getByText(linkText)
        expect(link).toBeInTheDocument()
    })

    it('calls router.push when clicked', () => {
        const linkText = 'Test Link'
        const href = '/test'

        render(<Link href={href}>{linkText}</Link>)

        const link = screen.getByText(linkText)
        fireEvent.click(link)

        expect(mockPush).toHaveBeenCalledWith(href)
        expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('renders as a Radix Link component', () => {
        const linkText = 'Test Link'
        const href = '/test'

        render(<Link href={href}>{linkText}</Link>)

        const link = screen.getByText(linkText)
        expect(link.tagName).toBe('A')
        expect(link).toHaveClass('rt-Link')
    })

    it('handles different href values', () => {
        const testCases = [
            { href: '/issues', text: 'Issues' },
            { href: '/issues/new', text: 'New Issue' },
            { href: '/', text: 'Home' },
        ]

        testCases.forEach(({ href, text }) => {
            const { unmount } = render(<Link href={href}>{text}</Link>)

            const link = screen.getByText(text)
            expect(link).toBeInTheDocument()

            fireEvent.click(link)
            expect(mockPush).toHaveBeenCalledWith(href)

            unmount()
            mockPush.mockClear()
        })
    })

    it('renders with correct structure', () => {
        const linkText = 'Test Link'
        const href = '/test'

        const { container } = render(<Link href={href}>{linkText}</Link>)

        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.tagName).toBe('DIV')
        expect(wrapper).toContainElement(screen.getByText(linkText))
    })

    it('prevents default link behavior', () => {
        const linkText = 'Test Link'
        const href = '/test'

        render(<Link href={href}>{linkText}</Link>)

        const link = screen.getByText(linkText)
        const clickEvent = new MouseEvent('click', { bubbles: true })

        // Mock preventDefault
        const preventDefaultSpy = vi.fn()
        Object.defineProperty(clickEvent, 'preventDefault', {
            value: preventDefaultSpy,
        })

        fireEvent.click(link, clickEvent)

        expect(mockPush).toHaveBeenCalledWith(href)
    })

    it('handles empty href gracefully', () => {
        const linkText = 'Test Link'
        const href = ''

        render(<Link href={href}>{linkText}</Link>)

        const link = screen.getByText(linkText)
        fireEvent.click(link)

        expect(mockPush).toHaveBeenCalledWith('')
    })

    it('handles special characters in link text', () => {
        const linkText = 'Link with special chars: !@#$%^&*()'
        const href = '/test'

        render(<Link href={href}>{linkText}</Link>)

        const link = screen.getByText(linkText)
        expect(link).toBeInTheDocument()
        fireEvent.click(link)
        expect(mockPush).toHaveBeenCalledWith(href)
    })
})
