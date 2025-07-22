import { gql } from '@apollo/client'

const GET_ISSUES_QUERY = gql`
  query GetIssues {
    issues {
      id
      title
      status
      createdAt
    }
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

export {GET_ISSUES_QUERY, GET_ISSUE_QUERY, UPDATE_ISSUE_MUTATION, CREATE_ISSUE_MUTATION, DELETE_ISSUE_MUTATION, GET_USERS_QUERY}