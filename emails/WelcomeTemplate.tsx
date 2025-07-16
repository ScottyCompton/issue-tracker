import React, { CSSProperties } from 'react'
import { Html, Body, Container, Text, Link, Preview, Tailwind } from '@react-email/components'

const WelcomeTemplate = ({ name }: { name: string }) => {
  return (
    <Html>
        <Preview>Welcome!</Preview>
        <Tailwind>
        <Body className='bg-white'>
            <Container>
                <Text className='text-3xl font-bold'>Hello {name}</Text>
                <Link href="https://www.google.com">Google</Link>
                </Container>
            </Body>
        </Tailwind>
    </Html>
    )
}

const body: CSSProperties = {
    backgroundColor: '#ffffff',
}

const heading: CSSProperties = {
    fontSize: '32px',
}

export default WelcomeTemplate