import { MdCheck, MdOutlineEdit, MdOutlineFlag } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import {
  InfraRequestCommandStatusEnum,
  RequestFormCommandStatusEnum,
  RequestFormSummary
} from '@redesignhealth/company-api-types'
import { useGetInfraRequest } from '@redesignhealth/portal/data-assets'
import { Box, Button, Card, Flex, Icon, Text } from '@redesignhealth/ui'

export const InfraFormCard = ({
  form,
  heading,
  description,
  to,
  ...restProps
}: {
  form?: RequestFormSummary
  heading: string
  description: string
  to: string
  'data-id': string
}) => {
  const { companyId } = useParams()
  const { data: infraRequest } = useGetInfraRequest(companyId, ['forms'])
  const infraRequestStatus = infraRequest?.status?.value

  const formStatus = form?.status?.value

  let buttonText = 'Start'
  let formStatusText = 'Not started'
  let formStatusIcon = MdOutlineFlag

  switch (formStatus) {
    case RequestFormCommandStatusEnum['Draft']: {
      buttonText = 'Continue editing'
      formStatusText = 'Draft'
      formStatusIcon = MdOutlineEdit
      break
    }
    case RequestFormCommandStatusEnum['Completed']: {
      if (
        infraRequestStatus === InfraRequestCommandStatusEnum['Done'] ||
        infraRequestStatus === InfraRequestCommandStatusEnum['Pending'] ||
        infraRequestStatus === InfraRequestCommandStatusEnum['In Progress']
      ) {
        buttonText = 'View submission'
        formStatusText = 'Submitted'
        formStatusIcon = MdCheck
      } else {
        buttonText = 'Review selections'
        formStatusText = 'Done'
      }
      break
    }
  }

  return (
    <Card as="section" mt="20px" p="16px" data-id={restProps['data-id']}>
      <Flex flexDir={{ base: 'column', lg: 'row' }} align={{ lg: 'center' }}>
        <Box>
          <Text
            as="h3"
            fontSize="16px"
            lineHeight="24px"
            fontWeight="medium"
            color="gray.700"
          >
            {heading}
          </Text>
          <Text
            as="p"
            fontSize="16px"
            lineHeight="24px"
            fontWeight="normal"
            color="gray.500"
            mt="2px"
          >
            {description}
          </Text>
        </Box>

        <Flex
          display={{ base: 'none', lg: 'flex' }}
          ml="auto"
          mr="32px"
          gap="16px"
          align="center"
        >
          <Icon as={formStatusIcon} color="primary.600" />
          <Text
            as="p"
            fontSize="16px"
            lineHeight="24px"
            fontWeight="medium"
            color="gray.500"
          >
            {formStatusText}
          </Text>
        </Flex>

        <Button
          as={Link}
          to={to}
          variant="outline"
          mt={{ base: '16px', lg: '0px' }}
        >
          {buttonText}
        </Button>
      </Flex>
    </Card>
  )
}
