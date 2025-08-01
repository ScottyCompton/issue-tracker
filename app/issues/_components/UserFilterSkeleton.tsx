import { Avatar, Flex } from '@radix-ui/themes'

const UserFilterSkeleton: React.FC = () => {
    return (
        <Flex gap="1">
            {/* "All" avatar skeleton */}
            <Avatar
                size="1"
                radius="full"
                fallback=""
                className="animate-pulse bg-gray-200"
            />

            {/* User avatar skeletons - show 3 placeholder avatars */}
            {Array.from({ length: 3 }).map((_, index) => (
                <Avatar
                    key={index}
                    size="1"
                    radius="full"
                    fallback=""
                    className="animate-pulse bg-gray-200"
                />
            ))}
        </Flex>
    )
}

export default UserFilterSkeleton
