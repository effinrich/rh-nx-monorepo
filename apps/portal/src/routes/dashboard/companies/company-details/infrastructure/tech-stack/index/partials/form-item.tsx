import {
  DrawerFormAccordion,
  DrawerFormAccordionProps,
  DrawerFormDescription,
  DrawerFormHeader,
  DrawerFormInput,
  DrawerFormRadioGroup
} from '@redesignhealth/portal/ui'
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel
} from '@redesignhealth/ui'

import { getInputName } from './utils'

interface FormItemProps {
  categoryName: string
  serviceName: string
  learnMoreItems?: DrawerFormAccordionProps['listItems']
  error?: string
  isReadOnly?: boolean
  radioDefaultValue?: string
  commentDefaultValue?: string
}

export const FormItem = ({
  error,
  serviceName,
  categoryName,
  isReadOnly,
  radioDefaultValue,
  commentDefaultValue,
  learnMoreItems
}: FormItemProps) => {
  return (
    <Flex
      flexDir="column"
      gap="16px"
      _first={{ mt: '16px' }}
      _notFirst={{ mt: '32px' }}
    >
      <FormControl isInvalid={Boolean(error)}>
        <DrawerFormHeader>{categoryName}</DrawerFormHeader>
        <DrawerFormDescription as={FormLabel}>
          {serviceName}
        </DrawerFormDescription>
        <Box mt="16px">
          <DrawerFormRadioGroup
            name={getInputName(categoryName, serviceName)}
            options={[{ value: 'Yes' }, { value: 'No' }]}
            isReadOnly={isReadOnly}
            defaultValue={radioDefaultValue}
          />
        </Box>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <DrawerFormHeader>Comment</DrawerFormHeader>
        <DrawerFormInput
          name={getInputName(categoryName, serviceName, true)}
          aria-label="If you answered no to the previous question, please provide an alternative service the company will use."
          placeholder="Enter an alternative service if your response was “No”"
          defaultValue={commentDefaultValue}
          isReadOnly={isReadOnly}
          mt="6px"
        />
      </FormControl>
      {learnMoreItems && (
        <DrawerFormAccordion title="Learn more" listItems={learnMoreItems} />
      )}
    </Flex>
  )
}
