/* eslint-disable no-console */
import * as React from 'react'

import { Meta } from '@storybook/react-vite'

import {
  Box,
  Separator,
  FieldLabel,
  FieldRoot,
  Heading,
  HStack,
  Icon,
  Stack,
  Text
} from '../../index'

import {
  CheckboxRoot,
  CheckboxControl,
  CheckboxLabel,
  CheckboxHiddenInput,
  CheckboxGroup
} from './checkbox'

export default {
  title: 'Components / Forms / Checkbox',
  component: CheckboxRoot
} as Meta

export const Basic = () => (
  <CheckboxRoot colorPalette="red">
    <CheckboxHiddenInput />
    <CheckboxControl />
    <CheckboxLabel>Hello</CheckboxLabel>
  </CheckboxRoot>
)

export const Disabled = () => (
  <CheckboxRoot disabled>
    <CheckboxHiddenInput />
    <CheckboxControl />
    <CheckboxLabel>Disabled</CheckboxLabel>
  </CheckboxRoot>
)

export const Readonly = () => (
  <CheckboxRoot readOnly>
    <CheckboxHiddenInput />
    <CheckboxControl />
    <CheckboxLabel>Readonly</CheckboxLabel>
  </CheckboxRoot>
)

export const Invalid = () => (
  <CheckboxRoot invalid>
    <CheckboxHiddenInput />
    <CheckboxControl />
    <CheckboxLabel>Invalid</CheckboxLabel>
  </CheckboxRoot>
)
export const NotFocusable = () => (
  <Box maxW="300px">
    <CheckboxRoot isFocusable={false}>
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>not focusable</CheckboxLabel>
    </CheckboxRoot>
    <CheckboxRoot isFocusable={false} disabled>
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>disabled and not focusable (truly disabled)</CheckboxLabel>
    </CheckboxRoot>
    <CheckboxRoot tabIndex={-1} isFocusable={false}>
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>Not Focusable with provided tabIndex</CheckboxLabel>
    </CheckboxRoot>
  </Box>
)

export const WithIconColor = () => (
  <CheckboxRoot iconColor="yellow.400">
    <CheckboxHiddenInput />
    <CheckboxControl />
    <CheckboxLabel>I love Redesign Health</CheckboxLabel>
  </CheckboxRoot>
)

export const WithColorScheme = () => {
  return (
    <Stack>
      <CheckboxRoot defaultChecked colorPalette="red">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Hello world</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot defaultChecked>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Hello world</CheckboxLabel>
      </CheckboxRoot>
    </Stack>
  )
}

const CustomIcon = (props: any) => {
  const { isIndeterminate, ...rest } = props

  const d = isIndeterminate
    ? 'M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,19a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,19Zm1.6-6.08a1,1,0,0,0-.6.917,1,1,0,1,1-2,0,3,3,0,0,1,1.8-2.75A2,2,0,1,0,10,9.255a1,1,0,1,1-2,0,4,4,0,1,1,5.6,3.666Z'
    : 'M0,12a1.5,1.5,0,0,0,1.5,1.5h8.75a.25.25,0,0,1,.25.25V22.5a1.5,1.5,0,0,0,3,0V13.75a.25.25,0,0,1,.25-.25H22.5a1.5,1.5,0,0,0,0-3H13.75a.25.25,0,0,1-.25-.25V1.5a1.5,1.5,0,0,0-3,0v8.75a.25.25,0,0,1-.25.25H1.5A1.5,1.5,0,0,0,0,12Z'

  return (
    <Icon viewBox="0 0 24 24" {...rest}>
      <path fill="currentColor" d={d} />
    </Icon>
  )
}

export const WithCustomIcon = () => {
  const [checkedItems, setCheckedItems] = React.useState([false, false])

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  return (
    <>
      <Heading>Default</Heading>
      <CheckboxRoot icon={<CustomIcon />} colorPalette="red">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Hello world</CheckboxLabel>
      </CheckboxRoot>

      <Separator />

      <Heading>Indeterminate</Heading>
      <CheckboxRoot
        checked={allChecked}
        indeterminate={isIndeterminate}
        onCheckedChange={e => {
          const next = e.checked === true
          setCheckedItems([next, next])
        }}
        icon={<CustomIcon />}
      >
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Parent Checkbox</CheckboxLabel>
      </CheckboxRoot>
      <Stack ml="6" mt="2" align="start">
        <CheckboxRoot
          checked={checkedItems[0]}
          onCheckedChange={e =>
            setCheckedItems([e.checked === true, checkedItems[1]])
          }
        >
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Child Checkbox 1</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot
          checked={checkedItems[1]}
          onCheckedChange={e =>
            setCheckedItems([checkedItems[0], e.checked === true])
          }
        >
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Child Checkbox 2</CheckboxLabel>
        </CheckboxRoot>
      </Stack>
    </>
  )
}

export const Sizes = () => {
  const sizes = ['sm', 'md', 'lg']

  return (
    <Stack direction="row">
      {sizes.map(size => (
        <CheckboxRoot key={size} size={size}>
          <CheckboxHiddenInput />
          <CheckboxControl />
        </CheckboxRoot>
      ))}
    </Stack>
  )
}

export const Indeterminate = () => {
  const [checkedItems, setCheckedItems] = React.useState([false, false])

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  return (
    <>
      <CheckboxRoot
        checked={allChecked}
        indeterminate={isIndeterminate}
        onCheckedChange={e => {
          const next = e.checked === true
          setCheckedItems([next, next])
        }}
      >
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Parent Checkbox</CheckboxLabel>
      </CheckboxRoot>
      <Stack ml="6" mt="2" align="start">
        <CheckboxRoot
          checked={checkedItems[0]}
          onCheckedChange={e =>
            setCheckedItems([e.checked === true, checkedItems[1]])
          }
        >
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Child Checkbox 1</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot
          checked={checkedItems[1]}
          onCheckedChange={e =>
            setCheckedItems([checkedItems[0], e.checked === true])
          }
        >
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Child Checkbox 2</CheckboxLabel>
        </CheckboxRoot>
      </Stack>
    </>
  )
}

export const Controlled = () => {
  const [value, setValue] = React.useState(false)

  return (
    <CheckboxRoot
      checked={value}
      onCheckedChange={e => setValue(e.checked === true)}
    >
      <CheckboxHiddenInput />
      <CheckboxControl />
    </CheckboxRoot>
  )
}

export const CheckboxGroupExample = () => {
  return (
    <CheckboxGroup
      defaultValue={['one', 'two']}
      onValueChange={value => console.log(value)}
    >
      <Stack align="start" direction={['column', 'row']} gap={[2, 4, 6]}>
        <CheckboxRoot value="one">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>One</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="two">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Two</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="three">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Three</CheckboxLabel>
        </CheckboxRoot>
      </Stack>
    </CheckboxGroup>
  )
}

export const ResponsiveCheckboxGroup = () => {
  return (
    <CheckboxGroup
      defaultValue={['one', 'two']}
      onValueChange={value => console.log(value)}
    >
      <Stack gap={[2, 4, 6]} direction={['column', 'row']}>
        <CheckboxRoot value="one">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>One</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="two">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Two</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="three">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Three</CheckboxLabel>
        </CheckboxRoot>
      </Stack>
    </CheckboxGroup>
  )
}

export const ControlledCheckboxGroup = () => {
  const [value, setValue] = React.useState<string[]>(['one', 'two'])
  return (
    <CheckboxGroup
      value={value}
      onValueChange={nextValue => {
        console.log(nextValue)
        setValue(nextValue)
      }}
    >
      <Stack direction="row" gap="40px">
        <CheckboxRoot value="one">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>One</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="two">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Two</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="three">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Three</CheckboxLabel>
        </CheckboxRoot>
      </Stack>
    </CheckboxGroup>
  )
}

export const CustomCheckboxGroup = () => {
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
export const WithField = () => {
  return (
    <>
      <FieldRoot id="optIn">
        <FieldLabel>Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['1', '3']}>
          <HStack>
            <CheckboxRoot value="1"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Opt-in 1</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="2"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Opt-in 2</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="3"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Opt-in 3</CheckboxLabel></CheckboxRoot>
          </HStack>
        </CheckboxGroup>
      </FieldRoot>

      <FieldRoot id="optInInvalid" invalid mt={4}>
        <FieldLabel>Invalid Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <CheckboxRoot value="1"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Invalid Opt-in 1</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="2"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Invalid Opt-in 2</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="3"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Invalid Opt-in 3</CheckboxLabel></CheckboxRoot>
          </Stack>
        </CheckboxGroup>
      </FieldRoot>

      <FieldRoot id="optInDisabled" disabled mt={4}>
        <FieldLabel>Disabled Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <CheckboxRoot value="1"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Disabled Opt-in 1</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="2"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Disabled Opt-in 2</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="3"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Disabled Opt-in 3</CheckboxLabel></CheckboxRoot>
          </Stack>
        </CheckboxGroup>
      </FieldRoot>

      <FieldRoot id="optInReadonly" readOnly mt={4}>
        <FieldLabel>Readonly Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <CheckboxRoot value="1"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Readonly Opt-in 1</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="2"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Readonly Opt-in 2</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="3"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Readonly Opt-in 3</CheckboxLabel></CheckboxRoot>
          </Stack>
        </CheckboxGroup>
      </FieldRoot>

      <FieldRoot id="optInRequired" required mt={4}>
        <FieldLabel>Required Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <CheckboxRoot value="1"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Required Opt-in 1</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="2"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Required Opt-in 2</CheckboxLabel></CheckboxRoot>
            <CheckboxRoot value="3"><CheckboxHiddenInput /><CheckboxControl /><CheckboxLabel>Required Opt-in 3</CheckboxLabel></CheckboxRoot>
          </Stack>
        </CheckboxGroup>
      </FieldRoot>
    </>
  )
}
