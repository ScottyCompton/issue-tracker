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

    type Project {
        id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!
    }

    type ProjectSummary {
        id: ID!
        name: String!
        issueCount: Int!
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
        user: User
        projectId: String
        project: Project
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
            projectId: String
            paging: IssuePaging
        ): [Issue!]!
        issueStatusCount(
            includeAll: Boolean = false
            projectId: String
        ): [IssueStatusCount!]!
        issuesCount(
            status: Status
            issueType: IssueType
            assignedToUserId: String
            projectId: String
        ): Int!
        latestIssues(projectId: String): [Issue!]!
        issue(id: ID!): Issue
        users: [User!]!
        projects: [Project!]!
        project(id: ID!): Project
        projectSummary: [ProjectSummary!]!
    }

    input CreateIssueInput {
        title: String!
        description: String!
        issueType: IssueType
        projectId: String
    }

    input UpdateIssueInput {
        title: String
        description: String
        status: Status
        issueType: IssueType
        assignedToUserId: String
        projectId: String
    }

    input CreateProjectInput {
        name: String!
        description: String
    }

    input UpdateProjectInput {
        name: String
        description: String
    }

    input IssueOrderBy {
        field: String!
        order: SortOrder!
    }

    input IssuePaging {
        skip: Int!
        take: Int!
    }

    type Mutation {
        createIssue(input: CreateIssueInput!): Issue!
        updateIssue(id: ID!, input: UpdateIssueInput!): Issue!
        deleteIssue(id: ID!): Boolean!
        updateIssueAssignee(id: ID!, input: UpdateIssueAssigneeInput!): Issue!
        createProject(input: CreateProjectInput!): Project!
        updateProject(id: ID!, input: UpdateProjectInput!): Project!
        deleteProject(id: ID!): Boolean!
    }

    input UpdateIssueAssigneeInput {
        assignedToUserId: String
    }
`
