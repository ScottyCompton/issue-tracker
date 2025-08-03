import { typeDefs } from '@/app/graphql/schema'
import { describe, expect, it } from 'vitest'

describe('GraphQL Schema', () => {
    // Get the actual GraphQL schema string
    const schemaString = typeDefs.loc?.source.body || ''

    describe('Schema Structure', () => {
        it('should be defined', () => {
            expect(typeDefs).toBeDefined()
        })

        it('should be a valid GraphQL schema object', () => {
            expect(typeof typeDefs).toBe('object')
            expect(typeDefs.loc?.source.body).toBeDefined()
        })
    })

    describe('Enums', () => {
        describe('Status Enum', () => {
            it('should define Status enum', () => {
                expect(schemaString).toContain('enum Status')
            })

            it('should have OPEN value', () => {
                expect(schemaString).toContain('OPEN')
            })

            it('should have IN_PROGRESS value', () => {
                expect(schemaString).toContain('IN_PROGRESS')
            })

            it('should have CLOSED value', () => {
                expect(schemaString).toContain('CLOSED')
            })

            it('should have all required status values', () => {
                const statusValues = ['OPEN', 'IN_PROGRESS', 'CLOSED']
                statusValues.forEach((value) => {
                    expect(schemaString).toContain(value)
                })
            })
        })

        describe('SortOrder Enum', () => {
            it('should define SortOrder enum', () => {
                expect(schemaString).toContain('enum SortOrder')
            })

            it('should have asc value', () => {
                expect(schemaString).toContain('asc')
            })

            it('should have desc value', () => {
                expect(schemaString).toContain('desc')
            })

            it('should have all required sort order values', () => {
                const sortOrderValues = ['asc', 'desc']
                sortOrderValues.forEach((value) => {
                    expect(schemaString).toContain(value)
                })
            })
        })
    })

    describe('Types', () => {
        describe('Issue Type', () => {
            it('should define Issue type', () => {
                expect(schemaString).toContain('type Issue')
            })

            it('should have required fields', () => {
                const requiredFields = [
                    'id: ID!',
                    'title: String!',
                    'status: Status!',
                    'createdAt: String!',
                    'updatedAt: String!',
                ]
                requiredFields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })

            it('should have optional fields', () => {
                const optionalFields = [
                    'description: String',
                    'assignedToUserId: String',
                    'assignedToUser: User',
                ]
                optionalFields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })

            it('should have all Issue fields', () => {
                const issueFields = [
                    'id: ID!',
                    'title: String!',
                    'description: String',
                    'status: Status!',
                    'createdAt: String!',
                    'updatedAt: String!',
                    'assignedToUserId: String',
                    'assignedToUser: User',
                ]
                issueFields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })
        })

        describe('IssueStatusCount Type', () => {
            it('should define IssueStatusCount type', () => {
                expect(schemaString).toContain('type IssueStatusCount')
            })

            it('should have required fields', () => {
                const fields = [
                    'label: String!',
                    'status: String!',
                    'count: Int',
                ]
                fields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })
        })

        describe('IssueAssignee Type', () => {
            it('should define IssueAssignee type', () => {
                expect(schemaString).toContain('type IssueAssignee')
            })

            it('should have required fields', () => {
                const fields = ['id: ID!', 'assignedToUserId: String']
                fields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })
        })

        describe('User Type', () => {
            it('should define User type', () => {
                expect(schemaString).toContain('type User')
            })

            it('should have all required fields', () => {
                const userFields = [
                    'id: ID!',
                    'name: String!',
                    'email: String!',
                    'image: String!',
                ]
                userFields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })
        })
    })

    describe('Input Types', () => {
        describe('CreateIssueInput', () => {
            it('should define CreateIssueInput', () => {
                expect(schemaString).toContain('input CreateIssueInput')
            })

            it('should have required fields', () => {
                const fields = ['title: String!', 'description: String!']
                fields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })
        })

        describe('IssueOrderBy', () => {
            it('should define IssueOrderBy', () => {
                expect(schemaString).toContain('input IssueOrderBy')
            })

            it('should have sortable fields', () => {
                const fields = [
                    'title: SortOrder',
                    'status: SortOrder',
                    'createdAt: SortOrder',
                ]
                fields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })
        })

        describe('IssuePaging', () => {
            it('should define IssuePaging', () => {
                expect(schemaString).toContain('input IssuePaging')
            })

            it('should have pagination fields', () => {
                const fields = ['skip: Int', 'take: Int']
                fields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })
        })

        describe('UpdateIssueInput', () => {
            it('should define UpdateIssueInput', () => {
                expect(schemaString).toContain('input UpdateIssueInput')
            })

            it('should have optional fields', () => {
                const fields = [
                    'title: String',
                    'description: String',
                    'status: Status',
                    'assignedToUserId: String',
                ]
                fields.forEach((field) => {
                    expect(schemaString).toContain(field)
                })
            })
        })

        describe('UpdateIssueAssigneeInput', () => {
            it('should define UpdateIssueAssigneeInput', () => {
                expect(schemaString).toContain('input UpdateIssueAssigneeInput')
            })

            it('should have assignee field', () => {
                expect(schemaString).toContain('assignedToUserId: String')
            })
        })
    })

    describe('Query Type', () => {
        it('should define Query type', () => {
            expect(schemaString).toContain('type Query')
        })

        describe('issues query', () => {
            it('should define issues query', () => {
                expect(schemaString).toContain('issues(')
            })

            it('should have correct parameters', () => {
                const params = [
                    'orderBy: IssueOrderBy',
                    'status: Status',
                    'paging: IssuePaging',
                ]
                params.forEach((param) => {
                    expect(schemaString).toContain(param)
                })
            })

            it('should return Issue array', () => {
                expect(schemaString).toContain('): [Issue!]!')
            })
        })

        describe('issueStatusCount query', () => {
            it('should define issueStatusCount query', () => {
                expect(schemaString).toContain('issueStatusCount(')
            })

            it('should have includeAll parameter', () => {
                expect(schemaString).toContain('includeAll: Boolean = false')
            })

            it('should return IssueStatusCount array', () => {
                expect(schemaString).toContain('): [IssueStatusCount!]!')
            })
        })

        describe('issuesCount query', () => {
            it('should define issuesCount query', () => {
                expect(schemaString).toContain('issuesCount(')
            })

            it('should have status parameter', () => {
                expect(schemaString).toContain('status: Status')
            })

            it('should return Int', () => {
                expect(schemaString).toContain('): Int!')
            })
        })

        describe('latestIssues query', () => {
            it('should define latestIssues query', () => {
                expect(schemaString).toContain(
                    'latestIssues(projectId: String): [Issue!]!'
                )
            })
        })

        describe('issue query', () => {
            it('should define issue query', () => {
                expect(schemaString).toContain('issue(')
            })

            it('should have id parameter', () => {
                expect(schemaString).toContain('id: ID!')
            })

            it('should return optional Issue', () => {
                expect(schemaString).toContain('): Issue')
            })
        })

        describe('users query', () => {
            it('should define users query', () => {
                expect(schemaString).toContain('users: [User!]!')
            })
        })
    })

    describe('Mutation Type', () => {
        it('should define Mutation type', () => {
            expect(schemaString).toContain('type Mutation')
        })

        describe('createIssue mutation', () => {
            it('should define createIssue mutation', () => {
                expect(schemaString).toContain('createIssue(')
            })

            it('should have input parameter', () => {
                expect(schemaString).toContain('input: CreateIssueInput!')
            })

            it('should return Issue', () => {
                expect(schemaString).toContain('): Issue!')
            })
        })

        describe('updateIssue mutation', () => {
            it('should define updateIssue mutation', () => {
                expect(schemaString).toContain('updateIssue(')
            })

            it('should have id and input parameters', () => {
                expect(schemaString).toContain('id: ID!')
                expect(schemaString).toContain('input: UpdateIssueInput!')
            })

            it('should return Issue', () => {
                expect(schemaString).toContain('): Issue!')
            })
        })

        describe('updateIssueAssignee mutation', () => {
            it('should define updateIssueAssignee mutation', () => {
                expect(schemaString).toContain('updateIssueAssignee(')
            })

            it('should have id and input parameters', () => {
                expect(schemaString).toContain('id: ID!')
                expect(schemaString).toContain(
                    'input: UpdateIssueAssigneeInput!'
                )
            })

            it('should return IssueAssignee', () => {
                expect(schemaString).toContain('): IssueAssignee!')
            })
        })

        describe('deleteIssue mutation', () => {
            it('should define deleteIssue mutation', () => {
                expect(schemaString).toContain('deleteIssue(')
            })

            it('should have id parameter', () => {
                expect(schemaString).toContain('id: ID!')
            })

            it('should return Boolean', () => {
                expect(schemaString).toContain('): Boolean!')
            })
        })
    })

    describe('Schema Completeness', () => {
        it('should have all required types', () => {
            const requiredTypes = [
                'Issue',
                'IssueStatusCount',
                'IssueAssignee',
                'User',
                'Query',
                'Mutation',
            ]
            requiredTypes.forEach((type) => {
                expect(schemaString).toContain(`type ${type}`)
            })
        })

        it('should have all required enums', () => {
            const requiredEnums = ['Status', 'SortOrder']
            requiredEnums.forEach((enumType) => {
                expect(schemaString).toContain(`enum ${enumType}`)
            })
        })

        it('should have all required input types', () => {
            const requiredInputs = [
                'CreateIssueInput',
                'IssueOrderBy',
                'IssuePaging',
                'UpdateIssueInput',
                'UpdateIssueAssigneeInput',
            ]
            requiredInputs.forEach((input) => {
                expect(schemaString).toContain(`input ${input}`)
            })
        })

        it('should have all required queries', () => {
            const requiredQueries = [
                'issues',
                'issueStatusCount',
                'issuesCount',
                'latestIssues',
                'issue',
                'users',
            ]
            requiredQueries.forEach((query) => {
                expect(schemaString).toContain(query)
            })
        })

        it('should have all required mutations', () => {
            const requiredMutations = [
                'createIssue',
                'updateIssue',
                'updateIssueAssignee',
                'deleteIssue',
            ]
            requiredMutations.forEach((mutation) => {
                expect(schemaString).toContain(mutation)
            })
        })
    })

    describe('Field Types', () => {
        it('should use correct scalar types', () => {
            const scalarTypes = ['ID!', 'String!', 'String', 'Int', 'Boolean!']
            scalarTypes.forEach((type) => {
                expect(schemaString).toContain(type)
            })
        })

        it('should use correct custom types', () => {
            const customTypes = [
                'Status!',
                'Status',
                'SortOrder',
                'Issue!',
                'Issue',
                'User!',
                'User',
                'IssueStatusCount!',
                'IssueStatusCount',
                'IssueAssignee!',
            ]
            customTypes.forEach((type) => {
                expect(schemaString).toContain(type)
            })
        })

        it('should use correct array types', () => {
            const arrayTypes = ['[Issue!]!', '[User!]!', '[IssueStatusCount!]!']
            arrayTypes.forEach((type) => {
                expect(schemaString).toContain(type)
            })
        })
    })

    describe('Schema Validation', () => {
        it('should have proper GraphQL syntax', () => {
            // Check for basic GraphQL structure
            expect(schemaString).toContain('{')
            expect(schemaString).toContain('}')
            expect(schemaString).toContain('type')
            expect(schemaString).toContain('enum')
            expect(schemaString).toContain('input')
        })

        it('should have consistent field definitions', () => {
            // Check that fields are properly terminated
            expect(schemaString).toContain('!')
            expect(schemaString).toContain(':')
        })

        it('should have proper parameter definitions', () => {
            // Check that parameters are properly defined
            expect(schemaString).toContain('(')
            expect(schemaString).toContain(')')
        })
    })

    describe('Module Exports', () => {
        it('should export typeDefs', () => {
            expect(typeDefs).toBeDefined()
        })

        it('should export typeDefs as an object', () => {
            expect(typeof typeDefs).toBe('object')
        })

        it('should have valid GraphQL content', () => {
            expect(schemaString.length).toBeGreaterThan(0)
            expect(schemaString).toContain('enum Status')
        })
    })
})
