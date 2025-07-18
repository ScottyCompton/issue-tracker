import prisma from "@/prisma/client"
import IssueForm from "../../_components/IssueForm"
import { notFound } from "next/navigation"

interface Props {
    params: Promise<
        {id: string}
    >
}

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