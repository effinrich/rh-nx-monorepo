import {
  RequestFormCommandStatusEnum,
  RequestFormSummary
} from '@redesignhealth/company-api-types'
import { Box, ListIcon, ListItem, Text } from '@redesignhealth/ui'

import { CompletedIcon, IncompletedIcon, InProgressIcon } from './partials'

export const InfraStep = ({
  form,
  header,
  description
}: {
  header: string
  description: string
  form?: RequestFormSummary
}) => {
  let formStatusIcon = IncompletedIcon
  if (form?.status?.value === RequestFormCommandStatusEnum['Draft'])
    formStatusIcon = InProgressIcon
  if (form?.status?.value === RequestFormCommandStatusEnum['Completed'])
    formStatusIcon = CompletedIcon

  return (
    <ListItem
      display="flex"
      _notFirst={{ mt: '16px' }}
      data-testid={form?.status?.value}
    >
      <ListIcon as={formStatusIcon} />
      <Box flex="1" ml="12px">
        <Text
          as="p"
          fontSize="16px"
          lineHeight="24px"
          fontWeight="bold"
          color="gray.700"
        >
          {header}
        </Text>
        <Text
          as="p"
          mt="2px"
          fontSize="16px"
          lineHeight="24px"
          fontWeight="normal"
          color="gray.500"
        >
          {description}
        </Text>
      </Box>
    </ListItem>
  )
}
