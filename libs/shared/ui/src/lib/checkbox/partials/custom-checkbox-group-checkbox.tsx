import * as React from 'react'

import { Box, Stack, Text } from '../../../index'

import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function CustomCheckboxGroupCheckbox() {
  const [value, setValue] = React.useState<string[]>(['2'])

  return (
    <Stack>
      <Text>The selected checkboxes are: {value.sort().join(' and ')}</Text>
      <CheckboxGroup value={value} onValueChange={setValue}>
        {['1', '2', '3'].map(item => (
          <CheckboxRoot
            key={item}
            value={item}
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={2}
            maxW="40"
            bg="green.50"
            border="1px solid"
            borderColor="green.500"
            rounded="lg"
            px={3}
            py={1}
            cursor="pointer"
          >
            <CheckboxHiddenInput />
            <CheckboxControl
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor="green.500"
              w={4}
              h={4}
            >
              {value.includes(item) && <Box w={2} h={2} bg="green.500" />}
            </CheckboxControl>
            <CheckboxLabel>Click me for {item}</CheckboxLabel>
          </CheckboxRoot>
        ))}
      </CheckboxGroup>
    </Stack>
  )
}
