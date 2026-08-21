import {
  MdOutlineInsertDriveFile,
  MdOutlineSimCardDownload,
  MdWebStories
} from 'react-icons/md'
import {
  Box,
  BoxProps,
  CardRoot,
  CardBody,
  CardFooter,
  CardHeader,
  Separator,
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
    const Icon = IconMap[contentType as keyof typeof IconMap] || DefaultIcon

    return <Icon size="22px" />
  }

  return (
    <CardRoot
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
            colorPalette="libIconGray"
            maxW="55px"
            maxH="55px"
          >
            {getIcon()}
          </IconButton>
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
        <Separator />
      </CardFooter>
    </CardRoot>
  )
}
