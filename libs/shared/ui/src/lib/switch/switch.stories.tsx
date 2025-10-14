import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { chakra } from '@chakra-ui/system'

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

export const Base = () => <Switch colorScheme="primary" />

export const Disabled = () => (
  <Switch isDisabled size="md" colorScheme="primary" margin="20px" />
)

export const Readonly = () => (
  <Switch isReadOnly size="md" colorScheme="primary" margin="20px" />
)

export const Invalid = () => (
  <Switch isInvalid size="md" colorScheme="primary" margin="20px" />
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
        isChecked={checked}
        colorScheme="green"
        onChange={e => setChecked(e.target.checked)}
      />
    </>
  )
}

export const StateDependingBehavior = () => {
  return (
    <FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
      <FormLabel htmlFor="isChecked">isChecked:</FormLabel>
      <Switch id="isChecked" isChecked />

      <FormLabel htmlFor="isDisabled">isDisabled:</FormLabel>
      <Switch id="isDisabled" isDisabled defaultChecked />

      <FormLabel htmlFor="isFocusable">isFocusable:</FormLabel>
      <Switch id="isFocusable" isFocusable isDisabled />

      <FormLabel htmlFor="isInvalid">isInvalid:</FormLabel>
      <Switch id="isInvalid" isInvalid />

      <FormLabel htmlFor="isReadOnly">isReadOnly:</FormLabel>
      <Switch id="isReadOnly" isReadOnly />

      <FormLabel htmlFor="isRequired">isRequired:</FormLabel>
      <Switch id="isRequired" isRequired />
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

      <FormControl id="optInInvalid" isInvalid mt={4}>
        <FormLabel>Invalid Opt-in Example</FormLabel>
        <Stack spacing={2}>
          <Switch value="1">Invalid Opt-in 1</Switch>
          <Switch value="2">Invalid Opt-in 2</Switch>
          <Switch value="3">Invalid Opt-in 3</Switch>
        </Stack>
      </FormControl>

      <FormControl id="optInDisabled" isDisabled mt={4}>
        <FormLabel>Disabled Opt-in Example</FormLabel>
        <Stack spacing={2}>
          <Switch value="1">Disabled Opt-in 1</Switch>
          <Switch value="2">Disabled Opt-in 2</Switch>
          <Switch value="3">Disabled Opt-in 3</Switch>
        </Stack>
      </FormControl>

      <FormControl id="optInReadonly" isReadOnly mt={4}>
        <FormLabel>Readonly Opt-in Example</FormLabel>
        <Stack spacing={2}>
          <Switch value="1">Readonly Opt-in 1</Switch>
          <Switch value="2">Readonly Opt-in 2</Switch>
          <Switch value="3">Readonly Opt-in 3</Switch>
        </Stack>
      </FormControl>

      <FormControl id="optInRequired" isRequired mt={4}>
        <FormLabel>Required Opt-in Example</FormLabel>
        <Stack spacing={2}>
          <Switch value="1">Required Opt-in 1</Switch>
          <Switch value="2">Required Opt-in 2</Switch>
          <Switch value="3">Required Opt-in 3</Switch>
        </Stack>
      </FormControl>
    </>
  )
}
