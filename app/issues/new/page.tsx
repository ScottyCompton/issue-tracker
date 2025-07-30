'use client'
import delay from 'delay'
import dynamic from 'next/dynamic'
import IssueFormSkeleton from '../_components/IssueFormSkeleton'

const IssueForm = dynamic(() => import('@/app/issues/_components/IssueForm'), {
    ssr: false,
    loading: () => <IssueFormSkeleton />,
})

const IssuePage = () => {
    return <IssueForm />
}

export default IssuePage
