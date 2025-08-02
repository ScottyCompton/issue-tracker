import { gql } from 'graphql-tag'

export const typeDefs = gql`
    enum Status {
        OPEN
        IN_PROGRESS
        CLOSED
    }

    enum IssueType {
        GENERAL
        BUG
        SPIKE
        TASK
        SUBTASK
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
        issueType: IssueType!
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
        id: ID!
        name: String!
        email: String!
        image: String!
    }

    type Query {
        issues(
            orderBy: IssueOrderBy
            status: Status
            issueType: IssueType
            assignedToUserId: String
            paging: IssuePaging
        ): [Issue!]!
        issueStatusCount(includeAll: Boolean = false): [IssueStatusCount!]!
        issuesCount(
            status: Status
            issueType: IssueType
            assignedToUserId: String
        ): Int!
        latestIssues: [Issue!]!
        issue(id: ID!): Issue
        users: [User!]!
    }

    input CreateIssueInput {
        title: String!
        description: String!
        issueType: IssueType
    }

    input IssueOrderBy {
        title: SortOrder
        status: SortOrder
        createdAt: SortOrder
        issueType: SortOrder
    }

    input IssuePaging {
        skip: Int
        take: Int
    }

    input UpdateIssueInput {
        title: String
        description: String
        status: Status
        issueType: IssueType
        assignedToUserId: String
    }

    input UpdateIssueAssigneeInput {
        assignedToUserId: String
    }

    type Mutation {
        createIssue(input: CreateIssueInput!): Issue!
        updateIssue(id: ID!, input: UpdateIssueInput!): Issue!
        updateIssueAssignee(
            id: ID!
            input: UpdateIssueAssigneeInput!
        ): IssueAssignee!
        deleteIssue(id: ID!): Boolean!
    }
`
