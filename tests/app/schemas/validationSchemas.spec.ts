import {
    issueSchema,
    updateIssueAssigneeSchema,
    updateIssueSchema,
} from '@/app/schemas/validationSchemas'
import { describe, expect, it } from 'vitest'

describe('validationSchemas', () => {
    describe('issueSchema', () => {
        it('should validate a valid issue', () => {
            const validIssue = {
                title: 'Test Issue',
                description: 'This is a test issue description',
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(validIssue)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validIssue)
            }
        })

        it('should reject issue with empty title', () => {
            const invalidIssue = {
                title: '',
                description: 'This is a test issue description',
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(invalidIssue)
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Title is required')
            }
        })

        it('should reject issue with missing title', () => {
            const invalidIssue = {
                description: 'This is a test issue description',
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(invalidIssue)
            expect(result.success).toBe(false)
        })

        it('should reject issue with title longer than 255 characters', () => {
            const invalidIssue = {
                title: 'a'.repeat(256),
                description: 'This is a test issue description',
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(invalidIssue)
            expect(result.success).toBe(false)
        })

        it('should reject issue with empty description', () => {
            const invalidIssue = {
                title: 'Test Issue',
                description: '',
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(invalidIssue)
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'Description is required'
                )
            }
        })

        it('should reject issue with missing description', () => {
            const invalidIssue = {
                title: 'Test Issue',
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(invalidIssue)
            expect(result.success).toBe(false)
        })

        it('should reject issue with description longer than 65536 characters', () => {
            const invalidIssue = {
                title: 'Test Issue',
                description: 'a'.repeat(65537),
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(invalidIssue)
            expect(result.success).toBe(false)
        })

        it('should accept issue with minimum valid data', () => {
            const validIssue = {
                title: 'A',
                description: 'A',
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(validIssue)
            expect(result.success).toBe(true)
        })

        it('should accept issue with maximum valid data', () => {
            const validIssue = {
                title: 'a'.repeat(255),
                description: 'a'.repeat(65536),
                issueType: 'GENERAL',
            }

            const result = issueSchema.safeParse(validIssue)
            expect(result.success).toBe(true)
        })
    })

    describe('updateIssueSchema', () => {
        it('should validate a valid update with all fields', () => {
            const validUpdate = {
                title: 'Updated Issue',
                description: 'Updated description',
                assignedToUserId: 'user123',
            }

            const result = updateIssueSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should validate a valid update with only title', () => {
            const validUpdate = {
                title: 'Updated Issue',
            }

            const result = updateIssueSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should validate a valid update with only description', () => {
            const validUpdate = {
                description: 'Updated description',
            }

            const result = updateIssueSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should validate a valid update with only assignedToUserId', () => {
            const validUpdate = {
                assignedToUserId: 'user123',
            }

            const result = updateIssueSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should validate an empty update object', () => {
            const validUpdate = {}

            const result = updateIssueSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should reject update with empty title', () => {
            const invalidUpdate = {
                title: '',
            }

            const result = updateIssueSchema.safeParse(invalidUpdate)
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Title is required')
            }
        })

        it('should reject update with title longer than 255 characters', () => {
            const invalidUpdate = {
                title: 'a'.repeat(256),
            }

            const result = updateIssueSchema.safeParse(invalidUpdate)
            expect(result.success).toBe(false)
        })

        it('should reject update with empty description', () => {
            const invalidUpdate = {
                description: '',
            }

            const result = updateIssueSchema.safeParse(invalidUpdate)
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'Description is required'
                )
            }
        })

        it('should reject update with description longer than 65536 characters', () => {
            const invalidUpdate = {
                description: 'a'.repeat(65537),
            }

            const result = updateIssueSchema.safeParse(invalidUpdate)
            expect(result.success).toBe(false)
        })

        it('should reject update with empty assignedToUserId', () => {
            const invalidUpdate = {
                assignedToUserId: '',
            }

            const result = updateIssueSchema.safeParse(invalidUpdate)
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'assignedToUserId is required'
                )
            }
        })

        it('should reject update with assignedToUserId longer than 255 characters', () => {
            const invalidUpdate = {
                assignedToUserId: 'a'.repeat(256),
            }

            const result = updateIssueSchema.safeParse(invalidUpdate)
            expect(result.success).toBe(false)
        })

        it('should accept update with null assignedToUserId', () => {
            const validUpdate = {
                assignedToUserId: null,
            }

            const result = updateIssueSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should accept update with undefined assignedToUserId', () => {
            const validUpdate = {
                assignedToUserId: undefined,
            }

            const result = updateIssueSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })
    })

    describe('updateIssueAssigneeSchema', () => {
        it('should validate a valid update with assignedToUserId', () => {
            const validUpdate = {
                assignedToUserId: 'user123',
            }

            const result = updateIssueAssigneeSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should validate an empty update object', () => {
            const validUpdate = {}

            const result = updateIssueAssigneeSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should reject update with empty assignedToUserId', () => {
            const invalidUpdate = {
                assignedToUserId: '',
            }

            const result = updateIssueAssigneeSchema.safeParse(invalidUpdate)
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'assignedToUserId is required'
                )
            }
        })

        it('should reject update with assignedToUserId longer than 255 characters', () => {
            const invalidUpdate = {
                assignedToUserId: 'a'.repeat(256),
            }

            const result = updateIssueAssigneeSchema.safeParse(invalidUpdate)
            expect(result.success).toBe(false)
        })

        it('should accept update with null assignedToUserId', () => {
            const validUpdate = {
                assignedToUserId: null,
            }

            const result = updateIssueAssigneeSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should accept update with undefined assignedToUserId', () => {
            const validUpdate = {
                assignedToUserId: undefined,
            }

            const result = updateIssueAssigneeSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should accept update with minimum valid assignedToUserId', () => {
            const validUpdate = {
                assignedToUserId: 'a',
            }

            const result = updateIssueAssigneeSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })

        it('should accept update with maximum valid assignedToUserId', () => {
            const validUpdate = {
                assignedToUserId: 'a'.repeat(255),
            }

            const result = updateIssueAssigneeSchema.safeParse(validUpdate)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validUpdate)
            }
        })
    })
})
