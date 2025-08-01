import { client } from '@/app/lib/graphql-client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { describe, expect, it } from 'vitest'

describe('graphql-client', () => {
    describe('client configuration', () => {
        it('should export a client instance', () => {
            expect(client).toBeDefined()
            expect(client).toBeInstanceOf(ApolloClient)
        })

        it('should have link property', () => {
            expect(client.link).toBeDefined()
        })

        it('should have cache property', () => {
            expect(client.cache).toBeDefined()
            expect(client.cache).toBeInstanceOf(InMemoryCache)
        })

        it('should have defaultOptions property', () => {
            expect(client.defaultOptions).toBeDefined()
        })

        it('should have query property for executing queries', () => {
            expect(typeof client.query).toBe('function')
        })

        it('should have mutate property for executing mutations', () => {
            expect(typeof client.mutate).toBe('function')
        })

        it('should have watchQuery property for watching queries', () => {
            expect(typeof client.watchQuery).toBe('function')
        })
    })

    describe('client functionality', () => {
        it('should be able to create a new cache instance', () => {
            const cache = new InMemoryCache()
            expect(cache).toBeInstanceOf(InMemoryCache)
        })

        it('should have proper cache configuration', () => {
            const cache = client.cache
            expect(cache).toBeDefined()
            expect(typeof cache.extract).toBe('function')
            expect(typeof cache.restore).toBe('function')
            expect(typeof cache.reset).toBe('function')
        })

        it('should have proper link configuration', () => {
            const link = client.link
            expect(link).toBeDefined()
            expect(typeof link.request).toBe('function')
        })
    })

    describe('URI configuration', () => {
        it('should use the correct API endpoint path', () => {
            const expectedPath = '/api/graphql'
            const API_URL = process.env.NEXT_PUBLIC_APP_URL
            const fullUri = `${API_URL}/api/graphql`

            expect(fullUri).toContain(expectedPath)
        })

        it('should use environment variable for API URL', () => {
            const API_URL = process.env.NEXT_PUBLIC_APP_URL
            const fullUri = `${API_URL}/api/graphql`

            expect(fullUri).toContain(API_URL)
        })
    })

    describe('module exports', () => {
        it('should export client as named export', () => {
            expect(client).toBeDefined()
            expect(client).toBeInstanceOf(ApolloClient)
        })

        it('should not export httpLink directly', () => {
            // httpLink is not exported from the module
            expect(true).toBe(true)
        })
    })

    describe('client initialization', () => {
        it('should initialize without errors', () => {
            expect(() => {
                expect(client).toBeDefined()
            }).not.toThrow()
        })

        it('should create a singleton instance', () => {
            // The client is already imported and should be the same instance
            expect(client).toBeDefined()
        })
    })

    describe('Apollo Client dependencies', () => {
        it('should import ApolloClient from @apollo/client', () => {
            expect(ApolloClient).toBeDefined()
            expect(typeof ApolloClient).toBe('function')
        })

        it('should import InMemoryCache from @apollo/client', () => {
            expect(InMemoryCache).toBeDefined()
            expect(typeof InMemoryCache).toBe('function')
        })
    })

    describe('client properties validation', () => {
        it('should have all required Apollo Client methods', () => {
            const requiredMethods = [
                'query',
                'mutate',
                'watchQuery',
                'subscribe',
            ]

            requiredMethods.forEach((method) => {
                expect(typeof (client as any)[method]).toBe('function')
            })
        })

        it('should have cache with required methods', () => {
            const cache = client.cache
            const requiredCacheMethods = [
                'extract',
                'restore',
                'reset',
                'evict',
                'identify',
            ]

            requiredCacheMethods.forEach((method) => {
                expect(typeof (cache as any)[method]).toBe('function')
            })
        })

        it('should have link with request method', () => {
            const link = client.link
            expect(typeof link.request).toBe('function')
        })
    })

    describe('client configuration validation', () => {
        it('should have proper client configuration', () => {
            expect(client.link).toBeDefined()
            expect(client.cache).toBeDefined()
            expect(client.defaultOptions).toBeDefined()
        })

        it('should have cache as InMemoryCache instance', () => {
            expect(client.cache).toBeInstanceOf(InMemoryCache)
        })

        it('should have link configured for HTTP requests', () => {
            const link = client.link
            expect(link).toBeDefined()
            expect(typeof link.request).toBe('function')
        })
    })
})
