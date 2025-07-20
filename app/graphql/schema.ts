import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type Issue {
    id: ID!
    title: String!
    description: String
    status: Status!
    createdAt: String!
    updatedAt: String!
  }

  enum Status {
    OPEN
    IN_PROGRESS
    CLOSED
  }

  type Query {
    issues: [Issue!]!
    issue(id: ID!): Issue
  }

  input CreateIssueInput {
    title: String!
    description: String!
  }

  input UpdateIssueInput {
    title: String
    description: String
    status: Status
  }

  type Mutation {
    createIssue(input: CreateIssueInput!): Issue!
    updateIssue(id: ID!, input: UpdateIssueInput!): Issue!
    deleteIssue(id: ID!): Boolean!
  }
` 