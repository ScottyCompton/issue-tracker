import { Card, Flex, Skeleton } from '@radix-ui/themes'

/**
 * LatestIssuesSkeleton - Loading skeleton for the LatestIssues component
 *
 * This component provides a skeleton loading state that matches the layout
 * of the LatestIssues component. It displays:
 * - A title skeleton
 * - Multiple skeleton rows with placeholders for issue data
 * - Avatar placeholders for assigned users
 *
 * Usage:
 * ```tsx
 * import { LatestIssuesSkeleton } from '@/app/components'
 *
 * // Direct usage
 * <LatestIssuesSkeleton />
 *
 * // With Suspense fallback
 * <Suspense fallback={<LatestIssuesSkeleton />}>
 *   <LatestIssues />
 * </Suspense>
 *
 * // With conditional loading
 * {isLoading ? <LatestIssuesSkeleton /> : <LatestIssues />}
 * ```
 */
const LatestIssuesSkeleton = () => {
    // Create skeleton rows for typical latest issues (3-5 items)
    const skeletonRows = [1, 2, 3, 4, 5]

    return (
        <Flex direction="column" className="w-full">
            <Skeleton className="max-w-xs mb-5" height="1.5rem" />
            <Card>
                <Flex direction="column" className="w-full">
                    {skeletonRows.map((index) => (
                        <Flex
                            key={index}
                            justify="between"
                            align="center"
                            className={`p-4 ${
                                index !== skeletonRows.length - 1
                                    ? 'border-b border-gray-200'
                                    : ''
                            }`}
                        >
                            <Flex
                                direction="column"
                                align="start"
                                gap="2"
                                className="flex-1"
                            >
                                <Skeleton className="w-48 h-4" />
                                <Skeleton className="w-20 h-5" />
                            </Flex>
                            <Skeleton className="w-6 h-6 rounded-full" />
                        </Flex>
                    ))}
                </Flex>
            </Card>
        </Flex>
    )
}

export default LatestIssuesSkeleton
