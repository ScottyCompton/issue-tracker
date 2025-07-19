import { Button } from '@radix-ui/themes'
import Link from 'next/link'


interface Props {
  loading?: boolean
}

const IssuesToolbar:React.FC<Props> = ({loading = false}: Props) => {
  return (
    <div className='mb-5 text-right'><Button disabled={loading}><Link href='/issues/new/'>Create Issue</Link></Button></div>
)
}

export default IssuesToolbar