'use client'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Button, Flex, Select, Text } from '@radix-ui/themes'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface Props {
    itemCount: number
    pageSize: number
    currentPage: number
}

const Pagination: React.FC<Props> = ({
    itemCount,
    pageSize,
    currentPage,
}: Props) => {
    const pageCount = Math.ceil(itemCount / pageSize)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Don't return null - we want to show the page size dropdown even when there's only one page

    const changePage = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        router.push('?' + params.toString())
    }

    const changePageSize = (newPageSize: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('pageSize', newPageSize)
        params.set('page', '1') // Reset to first page when changing page size
        router.push('?' + params.toString())
    }

    return (
        <Flex align="center" gap="2" justify="center" mt="5">
            <Text size="2">
                {pageCount > 1
                    ? `Page ${currentPage} of ${pageCount}`
                    : `${itemCount} items`}
            </Text>
            <Button
                color="gray"
                variant="soft"
                disabled={currentPage === 1 || pageCount <= 1}
                onClick={() => changePage(1)}
            >
                <DoubleArrowLeftIcon
                    className={
                        currentPage !== 1 && pageCount > 1
                            ? 'cursor-pointer'
                            : ''
                    }
                />{' '}
            </Button>
            <Button
                color="gray"
                variant="soft"
                disabled={currentPage === 1 || pageCount <= 1}
                onClick={() => changePage(currentPage - 1)}
            >
                <ChevronLeftIcon
                    className={
                        currentPage !== 1 && pageCount > 1
                            ? 'cursor-pointer'
                            : ''
                    }
                />{' '}
            </Button>
            <Button
                color="gray"
                variant="soft"
                disabled={currentPage === pageCount || pageCount <= 1}
                onClick={() => changePage(currentPage + 1)}
            >
                <ChevronRightIcon
                    className={
                        currentPage !== pageCount && pageCount > 1
                            ? 'cursor-pointer'
                            : ''
                    }
                />{' '}
            </Button>
            <Button
                color="gray"
                variant="soft"
                disabled={currentPage === pageCount || pageCount <= 1}
                onClick={() => changePage(pageCount)}
            >
                <DoubleArrowRightIcon
                    className={
                        currentPage !== pageCount && pageCount > 1
                            ? 'cursor-pointer'
                            : ''
                    }
                />{' '}
            </Button>
            <Select.Root
                value={pageSize.toString()}
                onValueChange={changePageSize}
            >
                <Select.Trigger placeholder="Page size" />
                <Select.Content>
                    <Select.Item value="5">5 per page</Select.Item>
                    <Select.Item value="10">10 per page</Select.Item>
                    <Select.Item value="25">25 per page</Select.Item>
                    <Select.Item value="50">50 per page</Select.Item>
                </Select.Content>
            </Select.Root>
        </Flex>
    )
}

export default Pagination
