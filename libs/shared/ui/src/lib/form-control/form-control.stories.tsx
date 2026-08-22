import { Meta } from '@storybook/react-vite'

import { Container } from '../../index'

import { FieldRoot } from './form-control'
import { BasicField } from './partials/basic-field'
import { WithErrorMessageField } from './partials/with-error-message-field'
import { WithFormikField } from './partials/with-formik-field'
import { WithNumberInputField } from './partials/with-number-input-field'
import { WithRadioGroupField } from './partials/with-radio-group-field'
import { WithRequiredFieldField } from './partials/with-required-field-field'
import { WithSelectField } from './partials/with-select-field'

export default {
  component: FieldRoot,
  title: 'Components / Forms / Field',
  decorators: [(Story: () => unknown) => <Container>{Story()}</Container>]
} as Meta<typeof FieldRoot>

export const Basic = {
  render: () => <BasicField />
}

export const WithRadioGroup = {
  render: () => <WithRadioGroupField />
}

export const WithErrorMessage = {
  render: () => <WithErrorMessageField />
}

export const WithRequiredField = {
  render: () => <WithRequiredFieldField />
}

export const WithSelect = {
  render: () => <WithSelectField />
}

export const WithNumberInput = {
  render: () => <WithNumberInputField />
}

export const WithFormik = {
  render: () => <WithFormikField />
}
