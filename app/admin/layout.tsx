import React, { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import NavBar from '../NavBar'

const inter = Inter({ subsets: ['latin'] })

interface Props {
    children: ReactNode
}

const AdminLayout = ({ children }: Props) => {
  return (
    <div className='flex'>
        <div><aside className='bg-slate-200 p-5 mr-5'>Admin Sidebar</aside></div>
        <div>{children}</div>
    </div>
    
  )
}

export default AdminLayout