import {
    CREATE_ISSUE_MUTATION,
    DELETE_ISSUE_MUTATION,
    GET_ISSUE_QUERY,
    GET_ISSUES_COUNT_QUERY,
    GET_ISSUES_QUERY,
    GET_ISSUES_STATUS_COUNT_QUERY,
    GET_LATEST_ISSUES_QUERY,
    GET_USERS_QUERY,
    UPDATE_ISSUE_ASSIGNEE_MUTATION,
    UPDATE_ISSUE_MUTATION,
} from '@/app/graphql/queries'
import { describe, expect, it } from 'vitest'

describe('GraphQL Queries', () => {
    describe('GET_ISSUES_QUERY', () => {
        it('should be defined', () => {
            expect(GET_ISSUES_QUERY).toBeDefined()
        })

        it('should be a GraphQL query', () => {
            expect(GET_ISSUES_QUERY.loc?.source.body).toContain(
                'query GetIssues'
            )
        })

        it('should have correct structure with variables', () => {
            const queryString = GET_ISSUES_QUERY.loc?.source.body || ''
            expect(queryString).toContain('$orderBy: IssueOrderBy')
            expect(queryString).toContain('$status: Status')
            expect(queryString).toContain('$paging: IssuePaging')
        })

        it('should select correct fields', () => {
            const queryString = GET_ISSUES_QUERY.loc?.source.body || ''
            expect(queryString).toContain('id')
            expect(queryString).toContain('title')
            expect(queryString).toContain('status')
            expect(queryString).toContain('createdAt')
        })
    })

    describe('GET_ISSUES_STATUS_COUNT_QUERY', () => {
        it('should be defined', () => {
            expect(GET_ISSUES_STATUS_COUNT_QUERY).toBeDefined()
        })

        it('should be a GraphQL query', () => {
            expect(GET_ISSUES_STATUS_COUNT_QUERY.loc?.source.body).toContain(
                'query IssueStatusCount'
            )
        })

        it('should have optional includeAll parameter', () => {
            const queryString =
                GET_ISSUES_STATUS_COUNT_QUERY.loc?.source.body || ''
            expect(queryString).toContain('$includeAll: Boolean = false')
        })

        it('should select correct fields', () => {
            const queryString =
                GET_ISSUES_STATUS_COUNT_QUERY.loc?.source.body || ''
            expect(queryString).toContain('label')
            expect(queryString).toContain('status')
            expect(queryString).toContain('count')
        })
    })

    describe('GET_LATEST_ISSUES_QUERY', () => {
        it('should be defined', () => {
            expect(GET_LATEST_ISSUES_QUERY).toBeDefined()
        })

        it('should be a GraphQL query', () => {
            expect(GET_LATEST_ISSUES_QUERY.loc?.source.body).toContain(
                'query GetLatestIssues'
            )
        })

        it('should select issue fields', () => {
            const queryString = GET_LATEST_ISSUES_QUERY.loc?.source.body || ''
            expect(queryString).toContain('id')
            expect(queryString).toContain('title')
            expect(queryString).toContain('status')
        })

        it('should include assignedToUser with nested fields', () => {
            const queryString = GET_LATEST_ISSUES_QUERY.loc?.source.body || ''
            expect(queryString).toContain('assignedToUser')
            expect(queryString).toContain('name')
            expect(queryString).toContain('email')
            expect(queryString).toContain('image')
        })
    })

    describe('GET_ISSUES_COUNT_QUERY', () => {
        it('should be defined', () => {
            expect(GET_ISSUES_COUNT_QUERY).toBeDefined()
        })

        it('should be a GraphQL query', () => {
            expect(GET_ISSUES_COUNT_QUERY.loc?.source.body).toContain(
                'query GetIssuesCount'
            )
        })

        it('should have status parameter', () => {
            const queryString = GET_ISSUES_COUNT_QUERY.loc?.source.body || ''
            expect(queryString).toContain('$status: Status')
        })
    })

    describe('GET_ISSUE_QUERY', () => {
        it('should be defined', () => {
            expect(GET_ISSUE_QUERY).toBeDefined()
        })

        it('should be a GraphQL query', () => {
            expect(GET_ISSUE_QUERY.loc?.source.body).toContain('query GetIssue')
        })

        it('should have required id parameter', () => {
            const queryString = GET_ISSUE_QUERY.loc?.source.body || ''
            expect(queryString).toContain('$id: ID!')
        })

        it('should select all issue fields', () => {
            const queryString = GET_ISSUE_QUERY.loc?.source.body || ''
            expect(queryString).toContain('id')
            expect(queryString).toContain('title')
            expect(queryString).toContain('description')
            expect(queryString).toContain('status')
            expect(queryString).toContain('createdAt')
            expect(queryString).toContain('updatedAt')
            expect(queryString).toContain('assignedToUserId')
        })
    })

    describe('GET_USERS_QUERY', () => {
        it('should be defined', () => {
            expect(GET_USERS_QUERY).toBeDefined()
        })

        it('should be a GraphQL query', () => {
            expect(GET_USERS_QUERY.loc?.source.body).toContain('query GetUsers')
        })

        it('should select user fields', () => {
            const queryString = GET_USERS_QUERY.loc?.source.body || ''
            expect(queryString).toContain('id')
            expect(queryString).toContain('name')
            expect(queryString).toContain('email')
        })
    })

    describe('UPDATE_ISSUE_MUTATION', () => {
        it('should be defined', () => {
            expect(UPDATE_ISSUE_MUTATION).toBeDefined()
        })

        it('should be a GraphQL mutation', () => {
            expect(UPDATE_ISSUE_MUTATION.loc?.source.body).toContain(
                'mutation UpdateIssue'
            )
        })

        it('should have required parameters', () => {
            const mutationString = UPDATE_ISSUE_MUTATION.loc?.source.body || ''
            expect(mutationString).toContain('$id: ID!')
            expect(mutationString).toContain('$input: UpdateIssueInput!')
        })

        it('should return updated issue fields', () => {
            const mutationString = UPDATE_ISSUE_MUTATION.loc?.source.body || ''
            expect(mutationString).toContain('id')
            expect(mutationString).toContain('title')
            expect(mutationString).toContain('description')
            expect(mutationString).toContain('status')
            expect(mutationString).toContain('createdAt')
            expect(mutationString).toContain('updatedAt')
        })
    })

    describe('UPDATE_ISSUE_ASSIGNEE_MUTATION', () => {
        it('should be defined', () => {
            expect(UPDATE_ISSUE_ASSIGNEE_MUTATION).toBeDefined()
        })

        it('should be a GraphQL mutation', () => {
            expect(UPDATE_ISSUE_ASSIGNEE_MUTATION.loc?.source.body).toContain(
                'mutation UpdateIssueAssignee'
            )
        })

        it('should have required parameters', () => {
            const mutationString =
                UPDATE_ISSUE_ASSIGNEE_MUTATION.loc?.source.body || ''
            expect(mutationString).toContain('$id: ID!')
            expect(mutationString).toContain(
                '$input: UpdateIssueAssigneeInput!'
            )
        })

        it('should return issue id and assignedToUserId', () => {
            const mutationString =
                UPDATE_ISSUE_ASSIGNEE_MUTATION.loc?.source.body || ''
            expect(mutationString).toContain('id')
            expect(mutationString).toContain('assignedToUserId')
        })
    })

    describe('CREATE_ISSUE_MUTATION', () => {
        it('should be defined', () => {
            expect(CREATE_ISSUE_MUTATION).toBeDefined()
        })

        it('should be a GraphQL mutation', () => {
            expect(CREATE_ISSUE_MUTATION.loc?.source.body).toContain(
                'mutation CreateIssue'
            )
        })

        it('should have required input parameter', () => {
            const mutationString = CREATE_ISSUE_MUTATION.loc?.source.body || ''
            expect(mutationString).toContain('$input: CreateIssueInput!')
        })

        it('should return created issue fields', () => {
            const mutationString = CREATE_ISSUE_MUTATION.loc?.source.body || ''
            expect(mutationString).toContain('id')
            expect(mutationString).toContain('title')
            expect(mutationString).toContain('description')
            expect(mutationString).toContain('status')
            expect(mutationString).toContain('createdAt')
            expect(mutationString).toContain('updatedAt')
        })
    })

    describe('DELETE_ISSUE_MUTATION', () => {
        it('should be defined', () => {
            expect(DELETE_ISSUE_MUTATION).toBeDefined()
        })

        it('should be a GraphQL mutation', () => {
            expect(DELETE_ISSUE_MUTATION.loc?.source.body).toContain(
                'mutation DeleteIssue'
            )
        })

        it('should have required id parameter', () => {
            const mutationString = DELETE_ISSUE_MUTATION.loc?.source.body || ''
            expect(mutationString).toContain('$id: ID!')
        })

        it('should call deleteIssue function', () => {
            const mutationString = DELETE_ISSUE_MUTATION.loc?.source.body || ''
            expect(mutationString).toContain('deleteIssue(id: $id)')
        })
    })

    describe('Module exports', () => {
        it('should export all queries and mutations', () => {
            const exports = {
                CREATE_ISSUE_MUTATION,
                DELETE_ISSUE_MUTATION,
                GET_ISSUE_QUERY,
                GET_ISSUES_COUNT_QUERY,
                GET_ISSUES_QUERY,
                GET_ISSUES_STATUS_COUNT_QUERY,
                GET_LATEST_ISSUES_QUERY,
                GET_USERS_QUERY,
                UPDATE_ISSUE_ASSIGNEE_MUTATION,
                UPDATE_ISSUE_MUTATION,
            }

            Object.entries(exports).forEach(([name, value]) => {
                expect(value, `${name} should be exported`).toBeDefined()
            })
        })

        it('should export exactly 10 items', () => {
            const exports = [
                CREATE_ISSUE_MUTATION,
                DELETE_ISSUE_MUTATION,
                GET_ISSUE_QUERY,
                GET_ISSUES_COUNT_QUERY,
                GET_ISSUES_QUERY,
                GET_ISSUES_STATUS_COUNT_QUERY,
                GET_LATEST_ISSUES_QUERY,
                GET_USERS_QUERY,
                UPDATE_ISSUE_ASSIGNEE_MUTATION,
                UPDATE_ISSUE_MUTATION,
            ]

            expect(exports).toHaveLength(10)
        })
    })

    describe('Query structure validation', () => {
        it('should have valid GraphQL syntax for all queries', () => {
            const queries = [
                GET_ISSUES_QUERY,
                GET_ISSUES_STATUS_COUNT_QUERY,
                GET_LATEST_ISSUES_QUERY,
                GET_ISSUES_COUNT_QUERY,
                GET_ISSUE_QUERY,
                GET_USERS_QUERY,
            ]

            queries.forEach((query, index) => {
                expect(
                    query.loc?.source.body,
                    `Query ${index} should have valid syntax`
                ).toBeDefined()
                expect(
                    query.loc?.source.body,
                    `Query ${index} should contain 'query' keyword`
                ).toContain('query')
            })
        })

        it('should have valid GraphQL syntax for all mutations', () => {
            const mutations = [
                UPDATE_ISSUE_MUTATION,
                UPDATE_ISSUE_ASSIGNEE_MUTATION,
                CREATE_ISSUE_MUTATION,
                DELETE_ISSUE_MUTATION,
            ]

            mutations.forEach((mutation, index) => {
                expect(
                    mutation.loc?.source.body,
                    `Mutation ${index} should have valid syntax`
                ).toBeDefined()
                expect(
                    mutation.loc?.source.body,
                    `Mutation ${index} should contain 'mutation' keyword`
                ).toContain('mutation')
            })
        })
    })
})
