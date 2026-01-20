/* eslint-disable no-console */
import * as React from 'react'

import { Meta } from '@storybook/react-vite'

import {
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Stack,
  Text
} from '../../index'

import { Checkbox, CheckboxGroup } from './checkbox'

export default {
  title: 'Components / Forms / Checkbox',
  component: Checkbox
} as Meta

export const Basic = () => <Checkbox colorPalette="red">Hello</Checkbox>

export const Disabled = () => <Checkbox disabled>Disabled</Checkbox>

export const Readonly = () => <Checkbox readOnly>Readonly</Checkbox>

export const Invalid = () => <Checkbox invalid>Invalid</Checkbox>
// NotFocusable and WithIconColor stories removed as props are deprecated in v3

export const WithColorPalette = () => {
  return (
    <Stack>
      <Checkbox defaultChecked colorPalette="red">
        Hello world
      </Checkbox>
      <Checkbox defaultChecked>Hello world</Checkbox>
    </Stack>
  )
}

// ... existing code ...

type CustomIconProps = React.ComponentProps<typeof Icon> & {
  isIndeterminate?: boolean
}

const CustomIcon = (props: CustomIconProps) => {
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
      <Checkbox icon={<CustomIcon />} colorPalette="red">
        Hello world
      </Checkbox>

      <Divider />

      <Heading>Indeterminate</Heading>
      <Checkbox
        checked={allChecked}
        isIndeterminate={isIndeterminate}
        onCheckedChange={({ checked }) =>
          setCheckedItems([!!checked, !!checked])
        }
        icon={<CustomIcon />}
      >
        Parent Checkbox
      </Checkbox>
      <Stack ml="6" mt="2" align="start">
        <Checkbox
          checked={checkedItems[0]}
          onCheckedChange={({ checked }) =>
            setCheckedItems([!!checked, checkedItems[1]])
          }
        >
          Child Checkbox 1
        </Checkbox>
        <Checkbox
          checked={checkedItems[1]}
          onCheckedChange={({ checked }) =>
            setCheckedItems([checkedItems[0], !!checked])
          }
        >
          Child Checkbox 2
        </Checkbox>
      </Stack>
    </>
  )
}

export const Sizes = () => {
  const sizes = ['sm', 'md', 'lg'] as const

  return (
    <Stack direction="row">
      {sizes.map(size => (
        <Checkbox key={size} size={size} />
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
      <Checkbox
        checked={allChecked}
        isIndeterminate={isIndeterminate}
        onCheckedChange={({ checked }) =>
          setCheckedItems([!!checked, !!checked])
        }
      >
        Parent Checkbox
      </Checkbox>
      <Stack ml="6" mt="2" align="start">
        <Checkbox
          checked={checkedItems[0]}
          onCheckedChange={({ checked }) =>
            setCheckedItems([!!checked, checkedItems[1]])
          }
        >
          Child Checkbox 1
        </Checkbox>
        <Checkbox
          checked={checkedItems[1]}
          onCheckedChange={({ checked }) =>
            setCheckedItems([checkedItems[0], !!checked])
          }
        >
          Child Checkbox 2
        </Checkbox>
      </Stack>
    </>
  )
}

export const Controlled = () => {
  const [value, setValue] = React.useState(false)

  return (
    <Checkbox
      checked={value}
      onCheckedChange={({ checked }) => setValue(!!checked)}
    />
  )
}

export const CheckboxGroupExample = () => {
  return (
    <CheckboxGroup
      defaultValue={['one', 'two']}
      onValueChange={value => console.log(value)}
    >
      <Stack align="start" direction={['column', 'row']} gap={[2, 4, 6]}>
        <Checkbox value="one">One</Checkbox>
        <Checkbox value="two">Two</Checkbox>
        <Checkbox value="three">Three</Checkbox>
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
        <Checkbox value="one">One</Checkbox>
        <Checkbox value="two">Two</Checkbox>
        <Checkbox value="three">Three</Checkbox>
      </Stack>
    </CheckboxGroup>
  )
}

export const ControlledCheckboxGroup = () => {
  const [value, setValue] = React.useState<string[]>(['one', 'two'])
  return (
    <CheckboxGroup
      value={value}
      onValueChange={(value: string[]) => {
        console.log(value)
        setValue(value)
      }}
    >
      <Stack direction="row" gap="40px">
        <Checkbox value="one">One</Checkbox>
        <Checkbox value="two">Two</Checkbox>
        <Checkbox value="three">Three</Checkbox>
      </Stack>
    </CheckboxGroup>
  )
}

export const CustomCheckboxGroup = () => {
  return (
    <CheckboxGroup defaultValue={['2']} onValueChange={console.log}>
      <Stack>
        <Text>The selected checkboxes are: (Use console to see value)</Text>
        {[1, 2, 3].map(val => (
          <Checkbox
            key={val}
            value={String(val)}
            variant="outline"
            px={3}
            py={1}
            cursor="pointer"
            borderWidth="1px"
            borderColor="green.500"
            _checked={{ bg: 'green.50', borderColor: 'green.500' }}
          >
            Click me for {val}
          </Checkbox>
        ))}
      </Stack>
    </CheckboxGroup>
  )
}
export const WithFormControl = () => {
  return (
    <>
      <FormControl id="optIn">
        <FormLabel>Opt-in Example</FormLabel>
        <CheckboxGroup defaultValue={['1', '3']}>
          <HStack>
            <Checkbox value="1">Opt-in 1</Checkbox>
            <Checkbox value="2">Opt-in 2</Checkbox>
            <Checkbox value="3">Opt-in 3</Checkbox>
          </HStack>
        </CheckboxGroup>
      </FormControl>

      <FormControl id="optInInvalid" invalid mt={4}>
        <FormLabel>Invalid Opt-in Example</FormLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <Checkbox value="1">Invalid Opt-in 1</Checkbox>
            <Checkbox value="2">Invalid Opt-in 2</Checkbox>
            <Checkbox value="3">Invalid Opt-in 3</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl id="optInDisabled" disabled mt={4}>
        <FormLabel>Disabled Opt-in Example</FormLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <Checkbox value="1">Disabled Opt-in 1</Checkbox>
            <Checkbox value="2">Disabled Opt-in 2</Checkbox>
            <Checkbox value="3">Disabled Opt-in 3</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl id="optInReadonly" readOnly mt={4}>
        <FormLabel>Readonly Opt-in Example</FormLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <Checkbox value="1">Readonly Opt-in 1</Checkbox>
            <Checkbox value="2">Readonly Opt-in 2</Checkbox>
            <Checkbox value="3">Readonly Opt-in 3</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl id="optInRequired" required mt={4}>
        <FormLabel>Required Opt-in Example</FormLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <Checkbox value="1">Required Opt-in 1</Checkbox>
            <Checkbox value="2">Required Opt-in 2</Checkbox>
            <Checkbox value="3">Required Opt-in 3</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>
    </>
  )
}
