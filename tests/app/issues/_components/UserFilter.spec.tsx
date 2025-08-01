import { GET_USERS_QUERY } from '@/app/graphql/queries'
import UserFilter, {
    handleUserSelect,
} from '@/app/issues/_components/UserFilter'
import { MockedProvider } from '@apollo/client/testing'
import { Theme } from '@radix-ui/themes'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockGet = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    useSearchParams: vi.fn(),
}))

const mockUseRouter = useRouter as any
const mockUseSearchParams = useSearchParams as any

// Custom render function with Theme provider
const customRender = (ui: React.ReactElement) => {
    return render(<Theme>{ui}</Theme>)
}

const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/john.jpg',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: 'https://example.com/jane.jpg',
    },
]

const mocks = [
    {
        request: {
            query: GET_USERS_QUERY,
        },
        result: {
            data: {
                users: mockUsers,
            },
        },
    },
]

const renderUserFilter = (currUserId?: string) => {
    return customRender(
        <MockedProvider mocks={mocks} addTypename={false}>
            <UserFilter currUserId={currUserId} />
        </MockedProvider>
    )
}

describe('UserFilter', () => {
    beforeEach(() => {
        mockPush.mockClear()
        mockGet.mockClear()
        // Clear search params by deleting all entries
        Array.from(mockSearchParams.keys()).forEach((key) => {
            mockSearchParams.delete(key)
        })

        mockUseRouter.mockReturnValue({
            push: mockPush,
        } as any)

        mockUseSearchParams.mockReturnValue(mockSearchParams as any)
    })

    it('renders loading state initially', () => {
        renderUserFilter()
        // Check for skeleton avatars instead of "Loading users..." text
        const skeletonAvatars = screen.getAllByText('', {
            selector: '.rt-AvatarRoot.animate-pulse',
        })
        expect(skeletonAvatars.length).toBeGreaterThan(0)
    })

    it('renders user avatars after loading', async () => {
        renderUserFilter()

        await waitFor(() => {
            const containers = document.querySelectorAll('.rt-AvatarRoot')
            expect(containers.length).toBeGreaterThan(0)
        })

        // Check that we have avatar containers
        const avatarContainers = screen.getAllByText('', {
            selector: '.rt-AvatarRoot',
        })
        expect(avatarContainers.length).toBeGreaterThan(0)
    })

    it('shows selected user with blue border', async () => {
        renderUserFilter('1')

        await waitFor(() => {
            const containers = document.querySelectorAll('.rt-AvatarRoot')
            expect(containers.length).toBeGreaterThan(0)
        })

        // Find the avatar with blue border (selected user)
        const avatarContainers = screen.getAllByText('', {
            selector: '.rt-AvatarRoot',
        })
        const selectedContainer = avatarContainers.find((container) =>
            container.classList.contains('border-blue-500')
        )
        expect(selectedContainer).toBeDefined()
    })

    it('calls handleUserSelect when user avatar is clicked', async () => {
        renderUserFilter()

        await waitFor(() => {
            const containers = document.querySelectorAll('.rt-AvatarRoot')
            expect(containers.length).toBeGreaterThan(0)
        })

        // Find and click the first user avatar (John) using test ID
        const userAvatar = screen.getByTestId('avatar-1')
        fireEvent.click(userAvatar)

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/issues/list/?userId=1')
        })
    })

    it('calls handleUserSelect when "All" avatar is clicked', async () => {
        renderUserFilter('1')

        await waitFor(() => {
            const containers = document.querySelectorAll('.rt-AvatarRoot')
            expect(containers.length).toBeGreaterThan(0)
        })

        // Find and click the "All" avatar (first avatar) using test ID
        const allAvatar = screen.getByTestId('avatar--1')
        fireEvent.click(allAvatar)

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/issues/list/')
        })
    })
})

describe('handleUserSelect', () => {
    let mockRouter: any
    let mockSearchParams: URLSearchParams

    beforeEach(() => {
        mockRouter = { push: vi.fn() }
        mockSearchParams = new URLSearchParams()
    })

    it('adds userId to query params when user is selected', () => {
        mockSearchParams.set('status', 'OPEN')
        mockSearchParams.set('page', '1')

        handleUserSelect('1', mockSearchParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list/?status=OPEN&page=1&userId=1'
        )
    })

    it('removes userId from query params when "all" is selected', () => {
        mockSearchParams.set('status', 'OPEN')
        mockSearchParams.set('userId', '1')

        handleUserSelect(null, mockSearchParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list/?status=OPEN'
        )
    })

    it('preserves existing query params', () => {
        mockSearchParams.set('status', 'OPEN')
        mockSearchParams.set('sortBy', 'title')
        mockSearchParams.set('sortOrder', 'asc')
        mockSearchParams.set('page', '2')
        mockSearchParams.set('pageSize', '10')

        handleUserSelect('2', mockSearchParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list/?status=OPEN&sortBy=title&sortOrder=asc&page=2&pageSize=10&userId=2'
        )
    })
})
