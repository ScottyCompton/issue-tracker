import { Pencil2Icon } from '@radix-ui/react-icons/dist/Pencil2Icon'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'

interface Props {
    issueId: string
}

const EditIssueButton:React.FC<Props> = ({issueId}: Props) => {
  return (
    <Button><Pencil2Icon /><Link href={`/issues/${issueId}/edit`}>Edit Issue</Link></Button>
  )
}

export default EditIssueButton