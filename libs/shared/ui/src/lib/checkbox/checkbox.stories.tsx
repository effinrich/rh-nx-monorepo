import { Meta } from '@storybook/react-vite'

import { BasicCheckbox } from './partials/basic-checkbox'
import { CheckboxGroupExampleCheckbox } from './partials/checkbox-group-example-checkbox'
import { ControlledCheckbox } from './partials/controlled-checkbox'
import { ControlledCheckboxGroupCheckbox } from './partials/controlled-checkbox-group-checkbox'
import { CustomCheckboxGroupCheckbox } from './partials/custom-checkbox-group-checkbox'
import { DisabledCheckbox } from './partials/disabled-checkbox'
import { IndeterminateCheckbox } from './partials/indeterminate-checkbox'
import { InvalidCheckbox } from './partials/invalid-checkbox'
import { NotFocusableCheckbox } from './partials/not-focusable-checkbox'
import { ReadonlyCheckbox } from './partials/readonly-checkbox'
import { ResponsiveCheckboxGroupCheckbox } from './partials/responsive-checkbox-group-checkbox'
import { SizesCheckbox } from './partials/sizes-checkbox'
import { WithColorSchemeCheckbox } from './partials/with-color-scheme-checkbox'
import { WithCustomIconCheckbox } from './partials/with-custom-icon-checkbox'
import { WithFieldCheckbox } from './partials/with-field-checkbox'
import { WithIconColorCheckbox } from './partials/with-icon-color-checkbox'
import { CheckboxRoot } from './checkbox'

export default {
  title: 'Components / Forms / Checkbox',
  component: CheckboxRoot
} as Meta

export const Basic = {
  render: () => <BasicCheckbox />
}

export const Disabled = {
  render: () => <DisabledCheckbox />
}

export const Readonly = {
  render: () => <ReadonlyCheckbox />
}

export const Invalid = {
  render: () => <InvalidCheckbox />
}

export const NotFocusable = {
  render: () => <NotFocusableCheckbox />
}

export const WithIconColor = {
  render: () => <WithIconColorCheckbox />
}

export const WithColorScheme = {
  render: () => <WithColorSchemeCheckbox />
}

export const WithCustomIcon = {
  render: () => <WithCustomIconCheckbox />
}

export const Sizes = {
  render: () => <SizesCheckbox />
}

export const Indeterminate = {
  render: () => <IndeterminateCheckbox />
}

export const Controlled = {
  render: () => <ControlledCheckbox />
}

export const CheckboxGroupExample = {
  render: () => <CheckboxGroupExampleCheckbox />
}

export const ResponsiveCheckboxGroup = {
  render: () => <ResponsiveCheckboxGroupCheckbox />
}

export const ControlledCheckboxGroup = {
  render: () => <ControlledCheckboxGroupCheckbox />
}

export const CustomCheckboxGroup = {
  render: () => <CustomCheckboxGroupCheckbox />
}

export const WithField = {
  render: () => <WithFieldCheckbox />
}
