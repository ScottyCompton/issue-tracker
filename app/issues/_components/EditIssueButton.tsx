import { Pencil2Icon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'

interface Props {
    issueId: string
}

const EditIssueButton: React.FC<Props> = ({ issueId }: Props) => {
    return (
        <Button>
            <Pencil2Icon />
            <Link href={`/issues/edit/${issueId}`}>Edit Issue</Link>
        </Button>
    )
}

export default EditIssueButton
