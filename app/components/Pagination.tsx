'use client'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Button, Flex, Text } from '@radix-ui/themes'
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

    if (pageCount <= 1) return null

    const changePage = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        router.push('?' + params.toString())
    }

    return (
        <Flex align="center" gap="2" justify="center" mt="5">
            <Text size="2">
                Page {currentPage} of {pageCount}
            </Text>
            <Button
                color="gray"
                variant="soft"
                disabled={currentPage === 1}
                onClick={() => changePage(1)}
            >
                <DoubleArrowLeftIcon
                    className={currentPage !== 1 ? 'cursor-pointer' : ''}
                />{' '}
            </Button>
            <Button
                color="gray"
                variant="soft"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
            >
                <ChevronLeftIcon
                    className={currentPage !== 1 ? 'cursor-pointer' : ''}
                />{' '}
            </Button>
            <Button
                color="gray"
                variant="soft"
                disabled={currentPage === pageCount}
                onClick={() => changePage(currentPage + 1)}
            >
                <ChevronRightIcon
                    className={
                        currentPage !== pageCount ? 'cursor-pointer' : ''
                    }
                />{' '}
            </Button>
            <Button
                color="gray"
                variant="soft"
                disabled={currentPage === pageCount}
                onClick={() => changePage(pageCount)}
            >
                <DoubleArrowRightIcon
                    className={
                        currentPage !== pageCount ? 'cursor-pointer' : ''
                    }
                />{' '}
            </Button>
        </Flex>
    )
}

export default Pagination
