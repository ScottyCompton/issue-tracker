import IssuesToolbar from '../_components/IssuesToolbar'
import IssuesList from '../_components/IssuesList'

interface Props {
  searchParams: Promise<{
    status: string
    sortBy?: string
    sortOrder?: string
  }>
}


const IssuesPage:React.FC<Props> = async ({searchParams}: Props) => {
  const {status, sortBy, sortOrder} = await searchParams
  return (
    <div>
        <IssuesToolbar currStatus={status} />
        <IssuesList filter={status} sortBy={sortBy} sortOrder={sortOrder} />
    </div>
  )
}
export const dynamic = 'force-dynamic';
export default IssuesPage