import { Box, Card, Flex, Skeleton } from '@radix-ui/themes'

const IssueDetailsPageLoading: React.FC = () => {
    return (
        <Box>
            <Skeleton className="max-w-xl" />
            <Flex className="space-x-3" my="2">
                <Skeleton width="4rem" />
                <Skeleton width="8rem" />
            </Flex>
            <Card className="prose" mt="4">
                <Skeleton>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque felis tellus, efficitur id convallis a, viverra
                    eget libero. Nam magna erat, fringilla sed commodo sed,
                    aliquet nec magna.
                </Skeleton>
                <Skeleton>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque felis tellus, efficitur id convallis a, viverra
                    eget libero. Nam magna erat, fringilla sed commodo sed,
                    aliquet nec magna.
                </Skeleton>
                <Skeleton>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque felis tellus, efficitur id convallis a, viverra
                    eget libero. Nam magna erat, fringilla sed commodo sed,
                    aliquet nec magna.
                </Skeleton>
            </Card>
        </Box>
    )
}

export default IssueDetailsPageLoading
