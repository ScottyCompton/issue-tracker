import Spinner from '@/app/components/Spinner'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../../utils/test-utils'

describe('Spinner', () => {
    it('renders loading spinner correctly', () => {
        render(<Spinner />)

        const spinner = screen.getByRole('status')
        expect(spinner).toBeInTheDocument()
        expect(spinner.tagName).toBe('DIV')
    })

    it('has correct accessibility attributes', () => {
        render(<Spinner />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveAttribute('role', 'status')
    })

    it('contains loading text for screen readers', () => {
        render(<Spinner />)

        const loadingText = screen.getByText('Loading...')
        expect(loadingText).toBeInTheDocument()
        expect(loadingText).toHaveClass(
            '!absolute',
            '!-m-px',
            '!h-px',
            '!w-px',
            '!overflow-hidden',
            '!whitespace-nowrap',
            '!border-0',
            '!p-0',
            '![clip:rect(0,0,0,0)]'
        )
    })

    it('has correct CSS classes for animation', () => {
        render(<Spinner />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveClass(
            'inline-block',
            'h-4',
            'w-4',
            'animate-spin',
            'rounded-full',
            'border-2',
            'border-solid',
            'border-current',
            'border-e-transparent',
            'align-[-0.125em]',
            'text-surface',
            'motion-reduce:animate-[spin_1.5s_linear_infinite]',
            'dark:text-white'
        )
    })

    it('renders as a div element', () => {
        render(<Spinner />)

        const spinner = screen.getByRole('status')
        expect(spinner.tagName).toBe('DIV')
    })

    it('has proper structure with hidden text', () => {
        render(<Spinner />)

        const spinner = screen.getByRole('status')
        const loadingText = screen.getByText('Loading...')

        expect(spinner).toContainElement(loadingText)
        expect(loadingText.tagName).toBe('SPAN')
    })

    it('maintains consistent structure across renders', () => {
        const { rerender } = render(<Spinner />)

        const firstSpinner = screen.getByRole('status')
        const firstText = screen.getByText('Loading...')

        rerender(<Spinner />)

        const secondSpinner = screen.getByRole('status')
        const secondText = screen.getByText('Loading...')

        expect(firstSpinner.tagName).toBe(secondSpinner.tagName)
        expect(firstText.tagName).toBe(secondText.tagName)
    })
})
