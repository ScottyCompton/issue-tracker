import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import IssueFormSkeleton from '../../_components/IssueFormSkeleton'
import { client as graphqlClient } from '@/app/lib/graphql-client'
import { GET_ISSUE_QUERY } from '@/app/graphql/queries'

interface Props {
    params: Promise<{ id: string }>
}

const IssueForm = dynamic(() => import('@/app/issues/_components/IssueForm'), {
    loading: () => <IssueFormSkeleton />,
})

const EditIssuePage: React.FC<Props> = async ({ params }: Props) => {
    const { id } = await params

    const { data } = await graphqlClient.query({
        query: GET_ISSUE_QUERY,
        variables: { id },
    })

    const issue = data.issue

    if (!issue) notFound()

    return <IssueForm issue={issue} />
}

export default EditIssuePage
