import prisma from "@/prisma/client"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import IssueFormSkeleton from "../../_components/IssueFormSkeleton"


interface Props {
    params: Promise<
        {id: string}
    >
}

const IssueForm = dynamic(() => import('@/app/issues/_components/IssueForm'), {
    loading: () => <IssueFormSkeleton />
})



const EditIssuePage:React.FC<Props> = async ({params}: Props) => {
    const {id} = await params
    const issue = await prisma.issue.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if(!issue) notFound()

  return (
    <IssueForm issue={issue} />
  )
}

export default EditIssuePage