import {
  Box,
  BoxProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading
} from '@redesignhealth/ui'

export interface LibCardProps extends BoxProps {
  title: string
  description?: string | undefined
  contentType: string
  to?: string
}

export const LibCard = ({
  title,
  description,
  contentType,
  ...props
}: LibCardProps) => {
  return (
    <Card
      {...props}
      cursor="pointer"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="none"
      _hover={{
        bg: 'primary.50',
        borderColor: 'primary.700'
      }}
      _activeLink={{ bg: 'primary.50', borderColor: 'primary.700' }}
    >
      <CardHeader display="flex" justifyContent="space-between" pb={3}>
        <Box>
          <Heading
            as="h3"
            fontSize="xs"
            lineHeight={5}
            fontWeight={700}
            color="gray.600"
            textTransform="uppercase"
          >
            {contentType}
          </Heading>
          <Heading
            as="h2"
            fontSize="lg"
            lineHeight={7}
            fontWeight={700}
            color="gray.800"
          >
            {title}
          </Heading>
        </Box>
      </CardHeader>
      <CardBody fontSize="md" lineHeight={6} color="gray.600" pt={0}>
        {description}
      </CardBody>
      <CardFooter>
        <Divider />
      </CardFooter>
    </Card>
  )
}

export default LibCard
