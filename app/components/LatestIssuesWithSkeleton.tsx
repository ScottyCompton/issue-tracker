import { Suspense } from 'react'
import LatestIssues from './LatestIssues'
import LatestIssuesSkeleton from './LatestIssuesSkeleton'

interface LatestIssuesWithSkeletonProps {
    isLoading?: boolean
}

const LatestIssuesWithSkeleton = ({
    isLoading = false,
}: LatestIssuesWithSkeletonProps) => {
    if (isLoading) {
        return <LatestIssuesSkeleton />
    }

    return (
        <Suspense fallback={<LatestIssuesSkeleton />}>
            <LatestIssues />
        </Suspense>
    )
}

export default LatestIssuesWithSkeleton
