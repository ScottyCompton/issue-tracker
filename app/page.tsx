import IssueChart from "./components/IssueChart/IssueChart"
import IssueSummary from "./components/IssueSummary"
import LatestIssues from "./components/LatestIssues"

export default function Home() {

  return (
    <>
    <div>Hello world</div>
    <LatestIssues />
    <IssueSummary />
    <IssueChart />
    </>
)
}
