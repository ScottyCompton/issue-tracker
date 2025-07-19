'use client'
import { Link as RadixLink } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

interface Props {
    href: string,
    children: string
}

const Link:React.FC<Props> = ({href, children}: Props) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(href) 
  }

  return (
    <div onClick={handleClick}>
        <RadixLink href='#' onClick={() => false}>{children}</RadixLink>
    </div>
  )
}

export default Link