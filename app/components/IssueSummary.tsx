import { client as graphqlClient } from '@/app/lib/graphql-client'
import { GET_ISSUES_STATUS_COUNT_QUERY } from '../graphql/queries'
import { Card, Flex, Text } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'

interface IssueStatusCount {
    label: string
    status: string
    count: number
}

const IssueSummary = async () => {

    const { data } = await graphqlClient.query({
        query: GET_ISSUES_STATUS_COUNT_QUERY,
        variables: {
            includeAll: true
        }
      })
     
     const { issueStatusCount } = data

    return (
        <Flex gap="3" className='mt-5'>
            {issueStatusCount.map((item: IssueStatusCount) => (
            <Card key={Math.floor(Math.random() * 1000)}>
                <Flex direction="column" gap="2">
                    <Link className='text-sm font-medium' href={`/issues/list/${item.status !== '' ? '?status=' + item.status : ''}`}>{item.label} Issues</Link>
                    <Text size="6" className='font-bold'>{item.count}</Text>
                </Flex>
            </Card>
           ) )}

        </Flex>
    )
}

export default IssueSummary
