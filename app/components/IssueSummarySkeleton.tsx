import { Card, Flex, Skeleton } from '@radix-ui/themes'

/**
 * IssueSummarySkeleton - Loading skeleton for the IssueSummary component
 *
 * This component provides a skeleton loading state that matches the layout
 * of the IssueSummary component. It displays:
 * - A title skeleton
 * - Three cards with skeleton placeholders for status counts
 *
 * Usage:
 * ```tsx
 * import { IssueSummarySkeleton } from '@/app/components'
 *
 * // Direct usage
 * <IssueSummarySkeleton />
 *
 * // With Suspense fallback
 * <Suspense fallback={<IssueSummarySkeleton />}>
 *   <IssueSummary />
 * </Suspense>
 *
 * // With conditional loading
 * {isLoading ? <IssueSummarySkeleton /> : <IssueSummary />}
 * ```
 */
const IssueSummarySkeleton = () => {
    // Create skeleton cards for typical status counts (Open, In Progress, Closed)
    const skeletonCards = [1, 2, 3]

    return (
        <Flex direction="column" className="w-full">
            <Skeleton className="max-w-xs mb-5" height="1.5rem" />
            <Flex gap="3" className="w-full">
                {skeletonCards.map((index) => (
                    <Card key={index} className="flex-1 w-full">
                        <Flex direction="column" gap="2">
                            <Skeleton className="text-xs" height="1rem" />
                            <Skeleton className="text-lg" height="1.5rem" />
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </Flex>
    )
}

export default IssueSummarySkeleton
