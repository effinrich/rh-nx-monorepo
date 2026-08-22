import { Container } from '@chakra-ui/react'

import { Meta } from '@storybook/react-vite'

import { Input } from './input'
import { BasicInput } from './partials/basic-input'
import { ControlledInput } from './partials/controlled-input'
import { InputGroupCustomInputPropsInput } from './partials/input-group-custom-input-props-input'
import { PasswordInputExample } from './partials/password-input-example'
import { WithFieldInput } from './partials/with-field-input'
import { WithFocusAndErrorColorsInput } from './partials/with-focus-and-error-colors-input'
import { WithInputAddonInput } from './partials/with-input-addon-input'
import { WithInputElementBugInput } from './partials/with-input-element-bug-input'
import { WithInputElementInput } from './partials/with-input-element-input'
import { WithSizesInput } from './partials/with-sizes-input'
import { WithStatesInput } from './partials/with-states-input'
import { WithVariantsInput } from './partials/with-variants-input'

export default {
  title: 'Components / Forms / Input',
  component: Input,
  decorators: [
    (Story: () => unknown) => (
      <Container>
        <Story />
      </Container>
    )
  ]
} as Meta

export const Basic = {
  render: () => <BasicInput />
}

export const Controlled = {
  render: () => <ControlledInput />
}

export const WithSizes = {
  render: () => <WithSizesInput />
}

export const WithStates = {
  render: () => <WithStatesInput />
}

export const WithVariants = {
  render: () => <WithVariantsInput />
}

export const WithInputAddon = {
  render: () => <WithInputAddonInput />
}

export const WithInputElement = {
  render: () => <WithInputElementInput />
}

export const PasswordInput = {
  render: () => <PasswordInputExample />
}

export const WithFocusAndErrorColors = {
  render: () => <WithFocusAndErrorColorsInput />
}

export const WithField = {
  render: () => <WithFieldInput />
}

export const WithInputElementBug = {
  render: () => <WithInputElementBugInput />
}

export const InputGroupCustomInputProps = {
  render: () => <InputGroupCustomInputPropsInput />
}
