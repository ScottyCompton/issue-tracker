import ErrorMessage from '@/app/components/ErrorMessage'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../../utils/test-utils'

describe('ErrorMessage', () => {
    it('renders error message when children are provided', () => {
        const errorMessage = 'This is an error message'
        render(<ErrorMessage>{errorMessage}</ErrorMessage>)

        const errorElement = screen.getByText(errorMessage)
        expect(errorElement).toBeInTheDocument()
        expect(errorElement.tagName).toBe('P')
        expect(errorElement).toHaveClass('rt-Text')
    })

    it('renders nothing when no children are provided', () => {
        const { container } = render(<ErrorMessage />)

        // Check that no error message text is rendered
        expect(screen.queryByText(/./)).not.toBeInTheDocument()
    })

    it('renders nothing when children is empty string', () => {
        const { container } = render(<ErrorMessage>{''}</ErrorMessage>)

        // Check that no error message text is rendered
        expect(screen.queryByText(/./)).not.toBeInTheDocument()
    })

    it('renders nothing when children is null', () => {
        const { container } = render(<ErrorMessage>{null as any}</ErrorMessage>)

        // Check that no error message text is rendered
        expect(screen.queryByText(/./)).not.toBeInTheDocument()
    })

    it('renders nothing when children is undefined', () => {
        const { container } = render(
            <ErrorMessage>{undefined as any}</ErrorMessage>
        )

        // Check that no error message text is rendered
        expect(screen.queryByText(/./)).not.toBeInTheDocument()
    })

    it('applies correct styling for error text', () => {
        const errorMessage = 'Test error'
        render(<ErrorMessage>{errorMessage}</ErrorMessage>)

        const errorElement = screen.getByText(errorMessage)
        expect(errorElement).toHaveClass('rt-Text')
    })

    it('renders multiple error messages correctly', () => {
        const errorMessages = ['Error 1', 'Error 2', 'Error 3']

        const { rerender } = render(
            <ErrorMessage>{errorMessages[0]}</ErrorMessage>
        )
        expect(screen.getByText('Error 1')).toBeInTheDocument()

        rerender(<ErrorMessage>{errorMessages[1]}</ErrorMessage>)
        expect(screen.getByText('Error 2')).toBeInTheDocument()

        rerender(<ErrorMessage>{errorMessages[2]}</ErrorMessage>)
        expect(screen.getByText('Error 3')).toBeInTheDocument()
    })

    it('handles special characters in error messages', () => {
        const specialError = 'Error with special chars: !@#$%^&*()'
        render(<ErrorMessage>{specialError}</ErrorMessage>)

        const errorElement = screen.getByText(specialError)
        expect(errorElement).toBeInTheDocument()
    })

    it('handles long error messages', () => {
        const longError =
            'This is a very long error message that should be handled properly by the component without any issues or truncation'
        render(<ErrorMessage>{longError}</ErrorMessage>)

        const errorElement = screen.getByText(longError)
        expect(errorElement).toBeInTheDocument()
    })
})
