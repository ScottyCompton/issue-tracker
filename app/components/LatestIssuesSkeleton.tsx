import { Card, Flex, Heading, Skeleton, Table } from '@radix-ui/themes'

/**
 * LatestIssuesSkeleton - Loading skeleton for the LatestIssues component
 *
 * This component provides a skeleton loading state that matches the layout
 * of the LatestIssues component. It displays:
 * - A title skeleton
 * - Multiple table rows with skeleton placeholders for issue data
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
        <Card>
            <Heading size="4" mb="5">
                Latest Issues
            </Heading>
            <Table.Root>
                <Table.Body>
                    {skeletonRows.map((index) => (
                        <Table.Row key={index}>
                            <Table.Cell>
                                <Flex justify="between" align="center">
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
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Card>
    )
}

export default LatestIssuesSkeleton
