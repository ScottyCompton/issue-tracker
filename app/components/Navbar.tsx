import Link from 'next/link'
import React from 'react'
import { BsBugFill } from "react-icons/bs";

const Navbar = () => {

    const links = [
        {label: 'Dashboard', href: '/'},
        {label: 'Issues', href: '/issues'},
    ]

  return (
    <nav className='flex space-x-6 border-b p-6'>
        <Link href="/"><BsBugFill size={24} /></Link>
        <ul className='flex space-x-6'>
            {links.map((link) => {
                return (
                    <li key={link.href}>
                        <Link className='text-zinc-500 hover:text-zinc-800 transition-colors' href={link.href}>{link.label}</Link>
                    </li>
                )
            })}

        </ul>
    </nav>
  )
}

export default Navbar