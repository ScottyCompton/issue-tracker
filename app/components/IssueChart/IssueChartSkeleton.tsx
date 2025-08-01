import { Card, Skeleton } from '@radix-ui/themes'

/**
 * IssueChartSkeleton - Loading skeleton for the IssueChart component
 *
 * This component provides a skeleton loading state that matches the layout
 * of the IssueChart component. It displays:
 * - A Card container with skeleton chart area
 * - Skeleton placeholders for the bar chart
 * - Proper dimensions matching the actual chart
 *
 * Usage:
 * ```tsx
 * import { IssueChartSkeleton } from '@/app/components/IssueChart'
 *
 * // Direct usage
 * <IssueChartSkeleton />
 *
 * // With Suspense fallback
 * <Suspense fallback={<IssueChartSkeleton />}>
 *   <IssueChart />
 * </Suspense>
 *
 * // With conditional loading
 * {isLoading ? <IssueChartSkeleton /> : <IssueChart />}
 * ```
 */
const IssueChartSkeleton = () => {
    return (
        <Card className="mt-5">
            <div className="w-full h-[300px] relative">
                {/* Chart area skeleton */}
                <div className="w-full h-full flex flex-col justify-end p-4">
                    {/* X-axis labels skeleton */}
                    <div className="flex justify-between mb-2">
                        {[1, 2, 3].map((index) => (
                            <Skeleton key={index} className="w-16 h-3" />
                        ))}
                    </div>

                    {/* Bars skeleton */}
                    <div className="flex justify-between items-end h-48 gap-4">
                        {[1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className="flex-1 flex flex-col items-center"
                            >
                                <Skeleton
                                    className="w-12 mb-2"
                                    style={{
                                        height: `${Math.random() * 60 + 40}%`,
                                        minHeight: '40px',
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Y-axis skeleton */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
                        {[1, 2, 3, 4].map((index) => (
                            <Skeleton key={index} className="w-8 h-2" />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default IssueChartSkeleton
