import { gql } from '@apollo/client'

const GET_ISSUES_QUERY = gql`
    query GetIssues(
        $orderBy: IssueOrderBy
        $status: Status
        $issueType: IssueType
        $assignedToUserId: String
        $projectId: String
        $paging: IssuePaging
    ) {
        issues(
            orderBy: $orderBy
            status: $status
            issueType: $issueType
            assignedToUserId: $assignedToUserId
            projectId: $projectId
            paging: $paging
        ) {
            id
            title
            status
            issueType
            createdAt
            projectId
            project {
                id
                name
            }
        }
    }
`

const GET_ISSUES_STATUS_COUNT_QUERY = gql`
    query IssueStatusCount($includeAll: Boolean = false, $projectId: String) {
        issueStatusCount(includeAll: $includeAll, projectId: $projectId) {
            label
            status
            count
        }
    }
`

const GET_LATEST_ISSUES_QUERY = gql`
    query GetLatestIssues($projectId: String) {
        latestIssues(projectId: $projectId) {
            id
            title
            status
            issueType
            projectId
            project {
                id
                name
            }
            user {
                id
                name
                email
                image
            }
        }
    }
`

const GET_ISSUES_COUNT_QUERY = gql`
    query GetIssuesCount(
        $status: Status
        $issueType: IssueType
        $assignedToUserId: String
        $projectId: String
    ) {
        issuesCount(
            status: $status
            issueType: $issueType
            assignedToUserId: $assignedToUserId
            projectId: $projectId
        )
    }
`

const GET_ISSUE_QUERY = gql`
    query GetIssue($id: ID!) {
        issue(id: $id) {
            id
            title
            description
            status
            issueType
            createdAt
            updatedAt
            assignedToUserId
            projectId
            project {
                id
                name
                description
            }
        }
    }
`

const GET_USERS_QUERY = gql`
    query GetUsers {
        users {
            id
            name
            email
            image
        }
    }
`

const GET_PROJECTS_QUERY = gql`
    query GetProjects {
        projects {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`

const GET_PROJECT_QUERY = gql`
    query GetProject($id: ID!) {
        project(id: $id) {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`

const GET_PROJECT_SUMMARY_QUERY = gql`
    query GetProjectSummary {
        projectSummary {
            id
            name
            issueCount
        }
    }
`

const CREATE_PROJECT_MUTATION = gql`
    mutation CreateProject($input: CreateProjectInput!) {
        createProject(input: $input) {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`

const UPDATE_PROJECT_MUTATION = gql`
    mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
        updateProject(id: $id, input: $input) {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`

const DELETE_PROJECT_MUTATION = gql`
    mutation DeleteProject($id: ID!) {
        deleteProject(id: $id)
    }
`

const UPDATE_ISSUE_MUTATION = gql`
    mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {
        updateIssue(id: $id, input: $input) {
            id
            title
            description
            status
            issueType
            createdAt
            updatedAt
            projectId
            project {
                id
                name
            }
        }
    }
`

const UPDATE_ISSUE_ASSIGNEE_MUTATION = gql`
    mutation UpdateIssueAssignee($id: ID!, $input: UpdateIssueAssigneeInput!) {
        updateIssueAssignee(id: $id, input: $input) {
            id
            assignedToUserId
        }
    }
`

const CREATE_ISSUE_MUTATION = gql`
    mutation CreateIssue($input: CreateIssueInput!) {
        createIssue(input: $input) {
            id
            title
            description
            status
            issueType
            createdAt
            updatedAt
            projectId
            project {
                id
                name
            }
        }
    }
`

const DELETE_ISSUE_MUTATION = gql`
    mutation DeleteIssue($id: ID!) {
        deleteIssue(id: $id)
    }
`

export {
    CREATE_ISSUE_MUTATION,
    CREATE_PROJECT_MUTATION,
    DELETE_ISSUE_MUTATION,
    DELETE_PROJECT_MUTATION,
    GET_ISSUE_QUERY,
    GET_ISSUES_COUNT_QUERY,
    GET_ISSUES_QUERY,
    GET_ISSUES_STATUS_COUNT_QUERY,
    GET_LATEST_ISSUES_QUERY,
    GET_PROJECT_QUERY,
    GET_PROJECT_SUMMARY_QUERY,
    GET_PROJECTS_QUERY,
    GET_USERS_QUERY,
    UPDATE_ISSUE_ASSIGNEE_MUTATION,
    UPDATE_ISSUE_MUTATION,
    UPDATE_PROJECT_MUTATION,
}
