import React, { ReactElement } from 'react'
import ModalButton1 from './components/ModalButton1'

const renderComponent = (code: ReactElement, title: string) => {
    return (
        <div className='p-4 border-b border-gray-700'>
            <h2>{title}</h2>
            <div>{code}</div>
        </div>
    )
}

const page = () => {
  return (
    <main className='p-4'>
        <h1 className='text-3xl font-bold mb-10'>Daisy UI Test</h1>
        <div>
            {renderComponent(
                <button className='btn btn-primary'>Click me</button>,
                'Button'
            )}
            {renderComponent(
                <ModalButton1 />
            , 'Modal')}
        </div>
    </main>
  )
}

export default page