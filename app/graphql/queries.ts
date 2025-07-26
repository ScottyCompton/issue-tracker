import { gql } from '@apollo/client'

const GET_ISSUES_QUERY = gql`
  query GetIssues($orderBy: IssueOrderBy, $status: Status, $paging: IssuePaging) {
    issues(orderBy: $orderBy, status: $status, paging: $paging) {
      id
      title
      status
      createdAt
    }
  }
`

const GET_ISSUES_STATUS_COUNT_QUERY = gql`
  query IssueStatusCount($includeAll: Boolean = false) {
    issueStatusCount(includeAll: $includeAll) {
      label,
      status,
      count
    }
  }
`

const GET_LATEST_ISSUES_QUERY = gql`
  query GetLatestIssues {
    latestIssues {
      id
      title
      status
      assignedToUser {
        id
        name
        email
        image
      }
    }
  }
`


const GET_ISSUES_COUNT_QUERY = gql`
  query GetIssuesCount($status: Status) {
    issuesCount(status: $status)
  }
`

const GET_ISSUE_QUERY = gql`
  query GetIssue($id: ID!) {
    issue(id: $id) {
      id
      title
      description
      status
      createdAt
      updatedAt
      assignedToUserId
    }
  }
`

const GET_USERS_QUERY = gql`
    query GetUsers {
        users {
            id
            name
            email
        }
    }
`

const UPDATE_ISSUE_MUTATION = gql`
  mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {
    updateIssue(id: $id, input: $input) {
      id
      title
      description
      status
      createdAt
      updatedAt
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
      createdAt
      updatedAt
    }
  }
`

const DELETE_ISSUE_MUTATION = gql`
  mutation DeleteIssue($id: ID!) {
    deleteIssue(id: $id)
  }
`

export {
    GET_ISSUES_QUERY, 
    GET_ISSUES_COUNT_QUERY,
    GET_LATEST_ISSUES_QUERY,
    GET_ISSUES_STATUS_COUNT_QUERY,
    GET_ISSUE_QUERY, 
    UPDATE_ISSUE_MUTATION, 
    CREATE_ISSUE_MUTATION, 
    DELETE_ISSUE_MUTATION, 
    GET_USERS_QUERY, 
    UPDATE_ISSUE_ASSIGNEE_MUTATION
}