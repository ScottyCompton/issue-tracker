import { Button } from '@radix-ui/themes'
import Link from 'next/link'

interface Props {
    issueId: string
}

const DeleteIssueButton:React.FC<Props> = ({issueId}: Props) => {
  return (
    <Button color="red"><Link href={`/issues/${issueId}/edit`}>Delete Issue</Link></Button>
  )
}

export default DeleteIssueButton