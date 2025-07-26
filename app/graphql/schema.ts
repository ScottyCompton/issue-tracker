import { gql } from 'graphql-tag'

export const typeDefs = gql`

  enum Status {
    OPEN
    IN_PROGRESS
    CLOSED
  }

  enum SortOrder {
    asc 
    desc
  }

  type Issue {
    id: ID!
    title: String!
    description: String
    status: Status!
    createdAt: String!
    updatedAt: String!
    assignedToUserId: String
    assignedToUser: User
  }

  type IssueStatusCount {
    label: String!
    status: String!
    count: Int
  }

  type IssueAssignee {
    id: ID!
    assignedToUserId: String
  }

  type User {
    id:  ID!
    name: String!
    email: String!
    image: String!
  }



  type Query {
    issues(orderBy: IssueOrderBy, status: Status, paging: IssuePaging): [Issue!]!
    issueStatusCount(includeAll: Boolean = false): [IssueStatusCount!]!
    issuesCount(status: Status): Int!
    latestIssues: [Issue!]!
    issue(id: ID!): Issue
    users: [User!]!
  }

  input CreateIssueInput {
    title: String!
    description: String!
  }

  input IssueOrderBy {
    title: SortOrder
    status: SortOrder
    createdAt: SortOrder
  }

  input IssuePaging {
    skip: Int
    take: Int
  }

  input UpdateIssueInput {
    title: String
    description: String
    status: Status
    assignedToUserId: String
  }

  input UpdateIssueAssigneeInput {
    assignedToUserId: String
  }

  type Mutation {
    createIssue(input: CreateIssueInput!): Issue!
    updateIssue(id: ID!, input: UpdateIssueInput!): Issue!
    updateIssueAssignee(id: ID!, input: UpdateIssueAssigneeInput!): IssueAssignee!
    deleteIssue(id: ID!): Boolean!
  }
` 