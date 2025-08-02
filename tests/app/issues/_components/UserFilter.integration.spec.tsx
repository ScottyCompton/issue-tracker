import { GET_USERS_QUERY } from '@/app/graphql/queries'
import UserFilter, {
    handleUserSelect,
} from '@/app/issues/_components/UserFilter'
import { MockedProvider } from '@apollo/client/testing'
import { Theme } from '@radix-ui/themes'
import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => mockSearchParams,
}))

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
    return render(
        <Theme>
            <MockedProvider mocks={mocks} addTypename={false}>
                <UserFilter currUserId={currUserId} />
            </MockedProvider>
        </Theme>
    )
}

describe('UserFilter Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Clear search params by deleting all entries
        Array.from(mockSearchParams.keys()).forEach((key) => {
            mockSearchParams.delete(key)
        })
    })

    it('renders the component and loads users', async () => {
        renderUserFilter()

        // Should show skeleton initially (loading state)
        const skeletonAvatars = document.querySelectorAll(
            '.animate-pulse.bg-gray-200'
        )
        expect(skeletonAvatars.length).toBeGreaterThan(0)

        // Should show avatar containers after loading
        await waitFor(() => {
            const containers = document.querySelectorAll('.rt-AvatarRoot')
            expect(containers.length).toBeGreaterThan(0)
        })

        // Should have avatar containers
        await waitFor(() => {
            const containers = document.querySelectorAll('.rt-AvatarRoot')
            expect(containers.length).toBeGreaterThan(0)
        })
    })

    it('shows selected user with correct styling', async () => {
        renderUserFilter('1')

        await waitFor(() => {
            const containers = document.querySelectorAll('.rt-AvatarRoot')
            expect(containers.length).toBeGreaterThan(0)
        })

        // Should have a selected avatar with blue border
        await waitFor(() => {
            const selectedContainer = document.querySelector(
                '.rt-AvatarRoot.border-blue-500'
            )
            expect(selectedContainer).toBeDefined()
        })
    })

    it('exports handleUserSelect function for testing', () => {
        expect(handleUserSelect).toBeDefined()
        expect(typeof handleUserSelect).toBe('function')
    })

    it('handleUserSelect function works correctly', () => {
        const mockRouter = { push: vi.fn() }
        const mockParams = new URLSearchParams()
        mockParams.set('status', 'OPEN')

        handleUserSelect('1', mockParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list/?status=OPEN&userId=1'
        )
    })

    it('handleUserSelect function removes user filter when userId is null', () => {
        const mockRouter = { push: vi.fn() }
        const mockParams = new URLSearchParams()
        mockParams.set('status', 'OPEN')
        mockParams.set('userId', '1') // Existing user filter

        handleUserSelect(null, mockParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list/?status=OPEN'
        )
    })

    it('handleUserSelect function preserves other params when removing userId', () => {
        const mockRouter = { push: vi.fn() }
        const mockParams = new URLSearchParams()
        mockParams.set('status', 'IN_PROGRESS')
        mockParams.set('sortBy', 'title')
        mockParams.set('sortOrder', 'desc')
        mockParams.set('page', '2')
        mockParams.set('userId', '1')

        handleUserSelect(null, mockParams, mockRouter)

        expect(mockRouter.push).toHaveBeenCalledWith(
            '/issues/list/?status=IN_PROGRESS&sortBy=title&sortOrder=desc&page=2'
        )
    })
})
