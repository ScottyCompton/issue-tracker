import { Suspense } from 'react'
import IssueSummary from './IssueSummary'
import IssueSummarySkeleton from './IssueSummarySkeleton'

interface IssueSummaryWithSkeletonProps {
    isLoading?: boolean
}

const IssueSummaryWithSkeleton = ({
    isLoading = false,
}: IssueSummaryWithSkeletonProps) => {
    if (isLoading) {
        return <IssueSummarySkeleton />
    }

    return (
        <Suspense fallback={<IssueSummarySkeleton />}>
            <IssueSummary />
        </Suspense>
    )
}

export default IssueSummaryWithSkeleton
