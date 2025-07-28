import { Theme } from '@radix-ui/themes'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode
        href: string
    }) => (
        <a href={href} data-testid="edit-issue-link">
            {children}
        </a>
    ),
}))

// Mock Radix UI icon
vi.mock('@radix-ui/react-icons', () => ({
    Pencil2Icon: () => <svg data-testid="pencil-icon" />,
}))

// Custom render function with Theme provider
const customRender = (ui: React.ReactElement) => {
    return render(<Theme>{ui}</Theme>)
}

describe('EditIssueButton', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders edit button with icon and link', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        customRender(<EditIssueButton issueId="123" />)

        expect(screen.getByText('Edit Issue')).toBeInTheDocument()
        expect(screen.getByTestId('edit-issue-link')).toBeInTheDocument()
        expect(screen.getByTestId('pencil-icon')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders with correct link href', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        customRender(<EditIssueButton issueId="456" />)

        const link = screen.getByTestId('edit-issue-link')
        expect(link).toHaveAttribute('href', '/issues/edit/456')
    })

    it('renders with empty issueId', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        customRender(<EditIssueButton issueId="" />)

        const link = screen.getByTestId('edit-issue-link')
        expect(link).toHaveAttribute('href', '/issues/edit/')
    })

    it('renders with numeric issueId', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        customRender(<EditIssueButton issueId="789" />)

        const link = screen.getByTestId('edit-issue-link')
        expect(link).toHaveAttribute('href', '/issues/edit/789')
    })

    it('renders with special character issueId', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        customRender(<EditIssueButton issueId="abc-123_xyz" />)

        const link = screen.getByTestId('edit-issue-link')
        expect(link).toHaveAttribute('href', '/issues/edit/abc-123_xyz')
    })

    it('renders with long issueId', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        const longId = 'a'.repeat(100)
        customRender(<EditIssueButton issueId={longId} />)

        const link = screen.getByTestId('edit-issue-link')
        expect(link).toHaveAttribute('href', `/issues/edit/${longId}`)
    })

    it('renders button with correct class', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        customRender(<EditIssueButton issueId="123" />)

        const button = screen.getByRole('button')
        expect(button).toHaveClass('rt-Button')
    })

    it('renders icon before text', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        const { container } = customRender(<EditIssueButton issueId="123" />)

        const button = screen.getByRole('button')
        const icon = screen.getByTestId('pencil-icon')
        const link = screen.getByTestId('edit-issue-link')
        // Icon should appear before the link in the button
        expect(button.firstChild).toBe(icon)
        expect(button.lastChild).toBe(link)
    })

    it('is a client-side component', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        expect(typeof EditIssueButton).toBe('function')
    })

    it('can be imported successfully', async () => {
        const { default: EditIssueButton } = await import(
            '@/app/issues/_components/EditIssueButton'
        )
        expect(EditIssueButton).toBeDefined()
    })
})
