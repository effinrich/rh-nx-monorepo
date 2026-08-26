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
  FieldErrorText,
  FieldLabel,
  FieldRoot
} from '@redesignhealth/ui'

import { getInputName } from './utils'

interface FormItemProps {
  categoryName: string
  serviceName: string
  learnMoreItems?: DrawerFormAccordionProps['listItems']
  error?: string
  readOnly?: boolean
  radioDefaultValue?: string
  commentDefaultValue?: string
}

export const FormItem = ({
  error,
  serviceName,
  categoryName,
  readOnly,
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
      <FieldRoot invalid={Boolean(error)}>
        <DrawerFormHeader>{categoryName}</DrawerFormHeader>
        <DrawerFormDescription as={FieldLabel}>
          {serviceName}
        </DrawerFormDescription>
        <Box mt="16px">
          <DrawerFormRadioGroup
            name={getInputName(categoryName, serviceName)}
            options={[{ value: 'Yes' }, { value: 'No' }]}
            readOnly={readOnly}
            defaultValue={radioDefaultValue}
          />
        </Box>
        {/* @ts-expect-error Chakra v3 children typing */}
        <FieldErrorText>{error}</FieldErrorText>
      </FieldRoot>
      <FieldRoot>
        <DrawerFormHeader>Comment</DrawerFormHeader>
        <DrawerFormInput
          name={getInputName(categoryName, serviceName, true)}
          aria-label="If you answered no to the previous question, please provide an alternative service the company will use."
          placeholder="Enter an alternative service if your response was “No”"
          defaultValue={commentDefaultValue}
          readOnly={readOnly}
          mt="6px"
        />
      </FieldRoot>
      {learnMoreItems && (
        <DrawerFormAccordion title="Learn more" listItems={learnMoreItems} />
      )}
    </Flex>
  )
}
