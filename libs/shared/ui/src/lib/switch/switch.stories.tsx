import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Meta } from '@storybook/react-vite'

import {
  Container,
  FormControl,
  FormLabel,
  HStack,
  SimpleGrid,
  Stack
} from '../../index'

import { Switch } from './switch'

export default {
  title: 'Components / Forms / Switch',
  component: Switch,
  decorators: [
    Story => (
      <Container maxWidth="lg" mx="auto" mt={6} p={6}>
        <Story />
      </Container>
    )
  ]
} as Meta

export const Base = () => <Switch colorPalette="primary" />

export const Disabled = () => (
  <Switch disabled size="md" colorPalette="primary" margin="20px" />
)

export const Readonly = () => (
  <Switch readOnly size="md" colorPalette="primary" margin="20px" />
)

export const Invalid = () => (
  <Switch invalid size="md" colorPalette="primary" margin="20px" />
)

export const Usage = () => (
  <Container display="flex" justifyContent="center" alignItems="center">
    <FormLabel htmlFor="email-alerts" mr="16px" mb="0">
      Enable email alerts?
    </FormLabel>
    <Switch id="email-alerts" />
  </Container>
)

export const Sizes = () => {
  return (
    <HStack>
      <Switch size="sm" />
      <Switch size="md" />
      <Switch size="lg" />
    </HStack>
  )
}

export const Controlled = () => {
  const [checked, setChecked] = useState(true)

  return (
    <>
      {checked ? 'Checked' : 'Unchecked'}{' '}
      <Switch
        checked={checked}
        colorPalette="green"
        onCheckedChange={({ checked }) => setChecked(!!checked)}
      />
    </>
  )
}

export const StateDependingBehavior = () => {
  return (
    <FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
      <FormLabel htmlFor="checked">checked:</FormLabel>
      <Switch id="checked" checked />

      <FormLabel htmlFor="disabled">disabled:</FormLabel>
      <Switch id="disabled" disabled defaultChecked />

      {/* isFocusable prop is removed in v3 */}
      <FormLabel htmlFor="isFocusable">disabled (focusable?):</FormLabel>
      <Switch id="isFocusable" disabled />

      <FormLabel htmlFor="invalid">invalid:</FormLabel>
      <Switch id="invalid" invalid />

      <FormLabel htmlFor="readOnly">readOnly:</FormLabel>
      <Switch id="readOnly" readOnly />

      <FormLabel htmlFor="required">required:</FormLabel>
      <Switch id="required" required />
    </FormControl>
  )
}

export const WithReactHookForm = () => {
  const defaultValues = {
    name: 'Hello',
    boolean: true,
    test: true
  }

  const { handleSubmit, register } = useForm({
    defaultValues
  })

  const onSubmit: SubmitHandler<{
    name: string
    boolean: boolean
  }> = values => {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="name" {...register('name')} />
      {/* <input type="Switch" {...register("boolean")} /> */}
      <Switch {...register('boolean')} />
      <button type="submit">Submit</button>
    </form>
  )
}

export const WithFormControl = () => {
  return (
    <>
      <FormControl id="optIn">
        <FormLabel>Opt-in Example</FormLabel>
        <Stack>
          <Switch value="1">Opt-in 1</Switch>
          <Switch value="2">Opt-in 2</Switch>
          <Switch value="3">Opt-in 3</Switch>
        </Stack>
      </FormControl>

      <FormControl id="optInInvalid" invalid mt={4}>
        <FormLabel>Invalid Opt-in Example</FormLabel>
        <Stack gap={2}>
          <Switch value="1">Invalid Opt-in 1</Switch>
          <Switch value="2">Invalid Opt-in 2</Switch>
          <Switch value="3">Invalid Opt-in 3</Switch>
        </Stack>
      </FormControl>

      <FormControl id="optInDisabled" disabled mt={4}>
        <FormLabel>Disabled Opt-in Example</FormLabel>
        <Stack gap={2}>
          <Switch value="1">Disabled Opt-in 1</Switch>
          <Switch value="2">Disabled Opt-in 2</Switch>
          <Switch value="3">Disabled Opt-in 3</Switch>
        </Stack>
      </FormControl>

      <FormControl id="optInReadonly" readOnly mt={4}>
        <FormLabel>Readonly Opt-in Example</FormLabel>
        <Stack gap={2}>
          <Switch value="1">Readonly Opt-in 1</Switch>
          <Switch value="2">Readonly Opt-in 2</Switch>
          <Switch value="3">Readonly Opt-in 3</Switch>
        </Stack>
      </FormControl>

      <FormControl id="optInRequired" required mt={4}>
        <FormLabel>Required Opt-in Example</FormLabel>
        <Stack gap={2}>
          <Switch value="1">Required Opt-in 1</Switch>
          <Switch value="2">Required Opt-in 2</Switch>
          <Switch value="3">Required Opt-in 3</Switch>
        </Stack>
      </FormControl>
    </>
  )
}
