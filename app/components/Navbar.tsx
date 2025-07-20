'use client'

import Link from 'next/link'
import React from 'react'
import { BsBugFill } from "react-icons/bs";
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { useSession } from 'next-auth/react'
import { Box } from '@radix-ui/themes';

const Navbar:React.FC = () => {
    const currentPath = usePathname()

    const {status, data: session} = useSession()

    const links = [
        {label: 'Dashboard', href: '/'},
        {label: 'Issues', href: '/issues/list'},
    ]

  return (
    <nav className='flex space-x-6 border-b p-6'>
        <Link href="/"><BsBugFill size={24} /></Link>
        <ul className='flex space-x-6'>
            {links.map((link) => {
                return (
                    <li key={link.href}>
                        <Link 
                            className={classNames({
                                'text-zink-900': link.href === currentPath,
                                'text-zinc-500': link.href !== currentPath,
                                'hover:text-zinc-800 transition-colors': true
                            })} 
                            href={link.href}>{link.label}</Link>
                    </li>
                )
            })}
        </ul>
        <Box>
        {status === 'authenticated' && <Link href="/api/auth/signout">Logout</Link>}
        {status === 'unauthenticated' && <Link href="/api/auth/signin">Login</Link>}
        </Box>
    </nav>
  )
}

export default Navbar
