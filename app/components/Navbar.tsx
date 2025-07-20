'use client'

import {
    Avatar,
    Box,
    Container,
    DropdownMenu,
    Flex,
    Text,
} from '@radix-ui/themes'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { BsBugFill } from 'react-icons/bs'

const Navbar: React.FC = () => {
    return (
        <nav className="border-b p-6">
            <Container>
                <Flex justify="between">
                    <NavLinks />
                    <Box>
                        <AuthStatus />
                    </Box>
                </Flex>
            </Container>
        </nav>
    )
}

const NavLinks = () => {
    const currentPath = usePathname()

    const links = [
        { label: 'Dashboard', href: '/' },
        { label: 'Issues', href: '/issues/list' },
    ]

    return (
        <Flex gap="6">
            <Link href="/">
                <BsBugFill size={24} />
            </Link>
            <ul className="flex space-x-6">
                {links.map((link) => {
                    return (
                        <li key={link.href}>
                            <Link
                                className={classNames({
                                    'text-zink-900': link.href === currentPath,
                                    'text-zinc-500': link.href !== currentPath,
                                    'hover:text-zinc-800 transition-colors': true,
                                })}
                                href={link.href}
                            >
                                {link.label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </Flex>
    )
}

const AuthStatus = () => {
    const { status, data: session } = useSession()

    if (status === 'loading') return null

    if (status === 'unauthenticated')
        return <Link href="/api/auth/signin">Login</Link>

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Avatar
                    className="cursor-pointer"
                    src={session!.user!.image!}
                    fallback="?"
                    radius="full"
                    size="2"
                    referrerPolicy="no-referrer"
                />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Label>
                    <Text size="2">{session!.user!.email}</Text>
                </DropdownMenu.Label>
                <DropdownMenu.Item>
                    <Link href="/api/auth/signout">Sign Out</Link>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default Navbar
