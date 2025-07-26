import { Flex, Grid } from '@radix-ui/themes'
import IssueChart from './components/IssueChart/IssueChart'
import IssueSummary from './components/IssueSummary'
import LatestIssues from './components/LatestIssues'

export default function Home() {
    return (
        <>
            <Grid columns={{ initial: '1', md: '2' }} gap="5">
                <Flex direction="column" gap="5">
                    <IssueSummary />
                    <IssueChart />
                </Flex>
                <LatestIssues />
            </Grid>
        </>
    )
}

export const metadata = {
    title: 'Issue Tracker - Dashboard',
    description: 'View a summary of project issues',
}
