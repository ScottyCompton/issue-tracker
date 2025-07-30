import { Text } from '@radix-ui/themes'

interface Props {
    children?: string
}

const ErrorMessage: React.FC<Props> = ({ children }: Props) => {
    if (!children) return null
    return (
        <Text color="red" as="p">
            {children}
        </Text>
    )
}

export default ErrorMessage
