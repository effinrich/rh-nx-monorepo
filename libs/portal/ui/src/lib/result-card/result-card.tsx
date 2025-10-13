import {
  MdOutlineInsertDriveFile,
  MdOutlineSimCardDownload,
  MdWebStories
} from 'react-icons/md'
import {
  Box,
  BoxProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  IconButton
} from '@redesignhealth/ui'
// import { motion } from 'framer-motion'

export interface ResultCardProps extends BoxProps {
  title: string
  description: string
  contentType: string
  to?: string
}

export const ResultCard = ({
  title,
  description,
  contentType,
  to,
  ...props
}: ResultCardProps) => {
  const getIcon = () => {
    const IconMap = {
      Solution: MdWebStories,
      Template: MdOutlineSimCardDownload,
      Module: MdOutlineInsertDriveFile
    }
    const DefaultIcon = MdWebStories
    const Icon = IconMap[contentType] || DefaultIcon

    return <Icon size="22px" />
  }

  return (
    <Card
      {...props}
      maxW="500px"
      // as={motion.div}
      // whileHover={{ scale: 1.025 }}
      // transition="0.025s linear"
    >
      <CardHeader display="flex" justifyContent="space-between" pb={3}>
        <Box>
          <Heading
            as="h3"
            fontSize="xs"
            lineHeight={4}
            fontWeight={700}
            color={`libType${contentType}.500`}
            textTransform="uppercase"
            pb={1}
          >
            {contentType}
          </Heading>
          <Heading
            as="h2"
            fontSize="lg"
            lineHeight={7}
            fontWeight={700}
            color="gray.700"
          >
            {title}
          </Heading>
        </Box>
        <Box>
          <IconButton
            aria-label="Search database"
            color={`libType${contentType}.500`}
            colorScheme="libIconGray"
            icon={getIcon()}
            maxW="55px"
            maxH="55px"
          />
        </Box>
      </CardHeader>
      <CardBody
        fontSize="md"
        lineHeight="base"
        fontWeight="normal"
        color="gray.500"
        pt={0}
      >
        {description}
      </CardBody>
      <CardFooter>
        <Divider />
      </CardFooter>
    </Card>
  )
}
