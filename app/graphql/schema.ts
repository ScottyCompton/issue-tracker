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
        assignedToUser: User
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

    input CreateProjectInput {
        name: String!
        description: String
    }

    input UpdateProjectInput {
        name: String
        description: String
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
        projectId: String
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
        createProject(input: CreateProjectInput!): Project!
        updateProject(id: ID!, input: UpdateProjectInput!): Project!
        deleteProject(id: ID!): Boolean!
    }
`
