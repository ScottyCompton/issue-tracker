import { Suspense } from 'react'
import IssueChart from './IssueChart'
import IssueChartSkeleton from './IssueChartSkeleton'

interface IssueChartWithSkeletonProps {
    isLoading?: boolean
}

const IssueChartWithSkeleton = ({
    isLoading = false,
}: IssueChartWithSkeletonProps) => {
    if (isLoading) {
        return <IssueChartSkeleton />
    }

    return (
        <Suspense fallback={<IssueChartSkeleton />}>
            <IssueChart />
        </Suspense>
    )
}

export default IssueChartWithSkeleton
