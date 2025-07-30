import ErrorPage from '@/app/error'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../utils/test-utils'

// Mock console.log to avoid cluttering test output
const mockConsoleLog = vi.fn()
vi.spyOn(console, 'log').mockImplementation(mockConsoleLog)

describe('ErrorPage', () => {
    const mockError = new Error('Test error message')
    const mockReset = vi.fn()

    beforeEach(() => {
        mockConsoleLog.mockClear()
        mockReset.mockClear()
    })

    it('renders error message correctly', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />)

        const errorMessage = screen.getByText(
            'An unexpected error has occurred'
        )
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage.tagName).toBe('DIV')
    })

    it('renders retry button correctly', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />)

        const retryButton = screen.getByRole('button', { name: /retry/i })
        expect(retryButton).toBeInTheDocument()
        expect(retryButton).toHaveClass('btn')
    })

    it('logs error to console', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', mockError)
    })

    it('calls reset function when retry button is clicked', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />)

        const retryButton = screen.getByRole('button', { name: /retry/i })
        fireEvent.click(retryButton)

        expect(mockReset).toHaveBeenCalledTimes(1)
    })

    it('handles different error types', () => {
        const testCases = [
            { error: new Error('Network error'), description: 'network error' },
            { error: new TypeError('Type error'), description: 'type error' },
            {
                error: new ReferenceError('Reference error'),
                description: 'reference error',
            },
            {
                error: new SyntaxError('Syntax error'),
                description: 'syntax error',
            },
        ]

        testCases.forEach(({ error, description }) => {
            const { unmount } = render(
                <ErrorPage error={error} reset={mockReset} />
            )

            expect(mockConsoleLog).toHaveBeenCalledWith('Error', error)
            expect(
                screen.getByText('An unexpected error has occurred')
            ).toBeInTheDocument()

            unmount()
            mockConsoleLog.mockClear()
        })
    })

    it('handles errors with no message', () => {
        const errorWithoutMessage = new Error()
        render(<ErrorPage error={errorWithoutMessage} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith(
            'Error',
            errorWithoutMessage
        )
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles errors with custom properties', () => {
        const customError = new Error('Custom error')
        ;(customError as any).customProperty = 'custom value'
        ;(customError as any).statusCode = 500

        render(<ErrorPage error={customError} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', customError)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles multiple reset button clicks', () => {
        render(<ErrorPage error={mockError} reset={mockReset} />)

        const retryButton = screen.getByRole('button', { name: /retry/i })

        fireEvent.click(retryButton)
        fireEvent.click(retryButton)
        fireEvent.click(retryButton)

        expect(mockReset).toHaveBeenCalledTimes(3)
    })

    it('handles async reset function', async () => {
        const asyncReset = vi.fn().mockImplementation(async () => {
            await new Promise((resolve) => setTimeout(resolve, 10))
        })

        render(<ErrorPage error={mockError} reset={asyncReset} />)

        const retryButton = screen.getByRole('button', { name: /retry/i })
        fireEvent.click(retryButton)

        expect(asyncReset).toHaveBeenCalledTimes(1)
    })

    it('handles null error gracefully', () => {
        const nullError = null as any
        render(<ErrorPage error={nullError} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', nullError)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles undefined error gracefully', () => {
        const undefinedError = undefined as any
        render(<ErrorPage error={undefinedError} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', undefinedError)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles non-Error objects', () => {
        const nonErrorObject = { message: 'Not an Error object' } as any
        render(<ErrorPage error={nonErrorObject} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', nonErrorObject)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles reset function that returns a value', () => {
        const resetWithReturn = vi.fn().mockReturnValue('reset result')
        render(<ErrorPage error={mockError} reset={resetWithReturn} />)

        const retryButton = screen.getByRole('button', { name: /retry/i })
        fireEvent.click(retryButton)

        expect(resetWithReturn).toHaveBeenCalledTimes(1)
    })

    it('maintains component structure with different error states', () => {
        const { rerender } = render(
            <ErrorPage error={mockError} reset={mockReset} />
        )

        // Initial render
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /retry/i })
        ).toBeInTheDocument()

        // Re-render with different error
        const newError = new Error('Different error')
        rerender(<ErrorPage error={newError} reset={mockReset} />)

        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /retry/i })
        ).toBeInTheDocument()
        expect(mockConsoleLog).toHaveBeenCalledWith('Error', newError)
    })

    it('handles errors with stack traces', () => {
        const errorWithStack = new Error('Error with stack')
        errorWithStack.stack =
            'Error: Error with stack\n    at test.js:1:1\n    at test.js:2:2'

        render(<ErrorPage error={errorWithStack} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', errorWithStack)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles errors with cause property', () => {
        const causeError = new Error('Cause error')
        const errorWithCause = new Error('Main error', { cause: causeError })

        render(<ErrorPage error={errorWithCause} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', errorWithCause)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles errors with custom name', () => {
        const customError = new Error('Custom error')
        customError.name = 'CustomErrorType'

        render(<ErrorPage error={customError} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', customError)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles very long error messages', () => {
        const longMessage = 'A'.repeat(1000)
        const longError = new Error(longMessage)

        render(<ErrorPage error={longError} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', longError)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles special characters in error messages', () => {
        const specialMessage =
            'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
        const specialError = new Error(specialMessage)

        render(<ErrorPage error={specialError} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', specialError)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })

    it('handles unicode characters in error messages', () => {
        const unicodeMessage = 'Error with unicode: 🚀🌟🎉中文日本語한국어'
        const unicodeError = new Error(unicodeMessage)

        render(<ErrorPage error={unicodeError} reset={mockReset} />)

        expect(mockConsoleLog).toHaveBeenCalledWith('Error', unicodeError)
        expect(
            screen.getByText('An unexpected error has occurred')
        ).toBeInTheDocument()
    })
})
