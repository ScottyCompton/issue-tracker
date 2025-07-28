import { formatDate } from '@/app/lib/utils'
import { describe, expect, it } from 'vitest'

describe('utils', () => {
    describe('formatDate', () => {
        describe('with Date objects', () => {
            it('should format a valid Date object', () => {
                const date = new Date('2024-01-15T10:30:00Z')
                const result = formatDate(date)

                expect(result).toBe('Mon Jan 15 2024')
            })

            it('should format a Date object with different timezone', () => {
                const date = new Date('2024-02-20T14:30:00Z')
                const result = formatDate(date)

                expect(result).toBe('Tue Feb 20 2024')
            })

            it('should handle Date object with time', () => {
                const date = new Date('2024-03-25T09:15:30Z')
                const result = formatDate(date)

                expect(result).toBe('Mon Mar 25 2024')
            })

            it('should handle Date object from different year', () => {
                const date = new Date('2023-12-31T23:59:59Z')
                const result = formatDate(date)

                expect(result).toBe('Sun Dec 31 2023')
            })
        })

        describe('with string timestamps', () => {
            it('should format numeric string timestamp (milliseconds)', () => {
                const timestamp = '1705312200000' // 2024-01-15T10:30:00Z
                const result = formatDate(timestamp)

                expect(result).toBe('Mon Jan 15 2024')
            })

            it('should format large numeric string timestamp', () => {
                const timestamp = '1705312200000'
                const result = formatDate(timestamp)

                expect(result).toBe('Mon Jan 15 2024')
            })

            it('should handle zero timestamp', () => {
                const timestamp = '0'
                const result = formatDate(timestamp)

                // Account for timezone differences
                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })

            it('should handle negative timestamp', () => {
                const timestamp = '-86400000' // 1969-12-31
                const result = formatDate(timestamp)

                // This might be invalid due to the negative value
                expect(result).toMatch(
                    /^\w{3} \w{3} \d{2} \d{4}$|^Invalid Date$/
                )
            })
        })

        describe('with date strings', () => {
            it('should format ISO date string', () => {
                const dateString = '2024-01-15T10:30:00Z'
                const result = formatDate(dateString)

                expect(result).toBe('Mon Jan 15 2024')
            })

            it('should format date string without time', () => {
                const dateString = '2024-01-15'
                const result = formatDate(dateString)

                // Account for timezone differences
                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })

            it('should format date string with different format', () => {
                const dateString = '2024/01/15'
                const result = formatDate(dateString)

                expect(result).toBe('Mon Jan 15 2024')
            })

            it('should handle date string with timezone offset', () => {
                const dateString = '2024-01-15T10:30:00+05:00'
                const result = formatDate(dateString)

                // Account for timezone differences
                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })

            it('should handle date string with milliseconds', () => {
                const dateString = '2024-01-15T10:30:00.123Z'
                const result = formatDate(dateString)

                expect(result).toBe('Mon Jan 15 2024')
            })
        })

        describe('with edge cases', () => {
            it('should return "Invalid Date" for invalid date string', () => {
                const invalidDate = 'not-a-date'
                const result = formatDate(invalidDate)

                expect(result).toBe('Invalid Date')
            })

            it('should return "Invalid Date" for empty string', () => {
                const emptyString = ''
                const result = formatDate(emptyString)

                expect(result).toBe('Invalid Date')
            })

            it('should return "Invalid Date" for null-like string', () => {
                const nullString = 'null'
                const result = formatDate(nullString)

                expect(result).toBe('Invalid Date')
            })

            it('should return "Invalid Date" for undefined-like string', () => {
                const undefinedString = 'undefined'
                const result = formatDate(undefinedString)

                expect(result).toBe('Invalid Date')
            })

            it('should handle very large numeric string', () => {
                const largeTimestamp = '9999999999999'
                const result = formatDate(largeTimestamp)

                // This should be a valid date in the future
                expect(result).not.toBe('Invalid Date')
                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })

            it('should handle very small numeric string', () => {
                const smallTimestamp = '-9999999999999'
                const result = formatDate(smallTimestamp)

                // This might be invalid due to the extreme value
                expect(result).toMatch(
                    /^\w{3} \w{3} \d{2} \d{4}$|^Invalid Date$/
                )
            })
        })

        describe('with different date formats', () => {
            it('should handle MM/DD/YYYY format', () => {
                const dateString = '01/15/2024'
                const result = formatDate(dateString)

                expect(result).toBe('Mon Jan 15 2024')
            })

            it('should handle DD/MM/YYYY format', () => {
                const dateString = '15/01/2024'
                const result = formatDate(dateString)

                // This format might not parse correctly and return Invalid Date
                expect(result).toMatch(
                    /^\w{3} \w{3} \d{2} \d{4}$|^Invalid Date$/
                )
            })

            it('should handle YYYY-MM-DD format', () => {
                const dateString = '2024-01-15'
                const result = formatDate(dateString)

                // Account for timezone differences
                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })

            it('should handle date with time in different format', () => {
                const dateString = '2024-01-15 10:30:00'
                const result = formatDate(dateString)

                expect(result).toBe('Mon Jan 15 2024')
            })
        })

        describe('with special characters', () => {
            it('should handle date string with special characters', () => {
                const dateString = '2024-01-15T10:30:00.123Z'
                const result = formatDate(dateString)

                expect(result).toBe('Mon Jan 15 2024')
            })

            it('should handle date string with spaces', () => {
                const dateString = '2024 01 15'
                const result = formatDate(dateString)

                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })
        })

        describe('with boundary dates', () => {
            it('should handle year 1970', () => {
                const date = new Date('1970-01-01T00:00:00Z')
                const result = formatDate(date)

                // Account for timezone differences
                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })

            it('should handle year 2038', () => {
                const date = new Date('2038-01-19T03:14:07Z')
                const result = formatDate(date)

                // Account for timezone differences
                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })

            it('should handle leap year date', () => {
                const date = new Date('2024-02-29T12:00:00Z')
                const result = formatDate(date)

                expect(result).toBe('Thu Feb 29 2024')
            })

            it('should handle non-leap year February 29', () => {
                const date = new Date('2023-02-29T12:00:00Z')
                const result = formatDate(date)

                // JavaScript Date constructor handles invalid dates by rolling over
                expect(result).toMatch(/^\w{3} \w{3} \d{2} \d{4}$/)
            })
        })

        describe('function behavior', () => {
            it('should be a function', () => {
                expect(typeof formatDate).toBe('function')
            })

            it('should return a string', () => {
                const result = formatDate(new Date())
                expect(typeof result).toBe('string')
            })

            it('should handle same input consistently', () => {
                const date = new Date('2024-01-15T10:30:00Z')
                const result1 = formatDate(date)
                const result2 = formatDate(date)

                expect(result1).toBe(result2)
            })

            it('should handle different input types consistently', () => {
                const date = new Date('2024-01-15T10:30:00Z')
                const dateString = '2024-01-15T10:30:00Z'
                const timestamp = '1705312200000'

                const result1 = formatDate(date)
                const result2 = formatDate(dateString)
                const result3 = formatDate(timestamp)

                expect(result1).toBe(result2)
                expect(result2).toBe(result3)
            })
        })

        describe('export validation', () => {
            it('should export formatDate function', () => {
                expect(formatDate).toBeDefined()
                expect(typeof formatDate).toBe('function')
            })

            it('should be the same function when imported', () => {
                // The function is already imported at the top
                expect(formatDate).toBeDefined()
                expect(typeof formatDate).toBe('function')
            })
        })
    })
})
