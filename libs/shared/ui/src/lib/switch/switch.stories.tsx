import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { chakra } from '@chakra-ui/react'

import { Meta } from '@storybook/react-vite'

import {
  Container,
  FieldLabel,
  FieldRoot,
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
    <chakra.label htmlFor="email-alerts" mr="16px">
      Enable email alerts?
    </chakra.label>
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
        onCheckedChange={e => setChecked(e.checked === true)}
      />
    </>
  )
}

export const StateDependingBehavior = () => {
  return (
    <FieldRoot as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
      <FieldLabel htmlFor="isChecked">isChecked:</FieldLabel>
      <Switch id="isChecked" checked />

      <FieldLabel htmlFor="isDisabled">isDisabled:</FieldLabel>
      <Switch id="isDisabled" disabled defaultChecked />

      <FieldLabel htmlFor="isFocusable">isFocusable:</FieldLabel>
      <Switch id="isFocusable" isFocusable disabled />

      <FieldLabel htmlFor="isInvalid">isInvalid:</FieldLabel>
      <Switch id="isInvalid" invalid />

      <FieldLabel htmlFor="isReadOnly">isReadOnly:</FieldLabel>
      <Switch id="isReadOnly" readOnly />

      <FieldLabel htmlFor="isRequired">isRequired:</FieldLabel>
      <Switch id="isRequired" required />
    </FieldRoot>
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

  const onSubmit: SubmitHandler<any> = values => {
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

export const WithField = () => {
  return (
    <>
      <FieldRoot id="optIn">
        <FieldLabel>Opt-in Example</FieldLabel>
        <Stack>
          <Switch value="1">Opt-in 1</Switch>
          <Switch value="2">Opt-in 2</Switch>
          <Switch value="3">Opt-in 3</Switch>
        </Stack>
      </FieldRoot>

      <FieldRoot id="optInInvalid" invalid mt={4}>
        <FieldLabel>Invalid Opt-in Example</FieldLabel>
        <Stack gap={2}>
          <Switch value="1">Invalid Opt-in 1</Switch>
          <Switch value="2">Invalid Opt-in 2</Switch>
          <Switch value="3">Invalid Opt-in 3</Switch>
        </Stack>
      </FieldRoot>

      <FieldRoot id="optInDisabled" disabled mt={4}>
        <FieldLabel>Disabled Opt-in Example</FieldLabel>
        <Stack gap={2}>
          <Switch value="1">Disabled Opt-in 1</Switch>
          <Switch value="2">Disabled Opt-in 2</Switch>
          <Switch value="3">Disabled Opt-in 3</Switch>
        </Stack>
      </FieldRoot>

      <FieldRoot id="optInReadonly" readOnly mt={4}>
        <FieldLabel>Readonly Opt-in Example</FieldLabel>
        <Stack gap={2}>
          <Switch value="1">Readonly Opt-in 1</Switch>
          <Switch value="2">Readonly Opt-in 2</Switch>
          <Switch value="3">Readonly Opt-in 3</Switch>
        </Stack>
      </FieldRoot>

      <FieldRoot id="optInRequired" required mt={4}>
        <FieldLabel>Required Opt-in Example</FieldLabel>
        <Stack gap={2}>
          <Switch value="1">Required Opt-in 1</Switch>
          <Switch value="2">Required Opt-in 2</Switch>
          <Switch value="3">Required Opt-in 3</Switch>
        </Stack>
      </FieldRoot>
    </>
  )
}
