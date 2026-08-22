import { Meta, StoryObj } from '@storybook/react-vite'

import { rh } from '../../index'

import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot
} from './number-input'
import { AllowOutOfRangeNumberInput } from './partials/allow-out-of-range-number-input'
import { BasicNumberInput } from './partials/basic-number-input'
import { FormatAndParseNumberInput } from './partials/format-and-parse-number-input'
import { SizesNumberInput } from './partials/sizes-number-input'
import { UseNumberInputExample } from './partials/use-number-input-example'
import { WithClampValueDisabledNumberInput } from './partials/with-clamp-value-disabled-number-input'
import { WithFieldNumberInput } from './partials/with-field-number-input'
import { WithMinAndMaxNumberInput } from './partials/with-min-and-max-number-input'
import { WithPrecisionNumberInput } from './partials/with-precision-number-input'
import { WithReactHookFormNumberInput } from './partials/with-react-hook-form-number-input'
import { WithStepNumberInput } from './partials/with-step-number-input'

export default {
  title: 'Components / Forms / NumberInput',
  component: NumberInputRoot,
  decorators: [
    (story: () => unknown) => (
      <rh.div maxW="400px" mt="40px" mx="auto">
        {story()}
      </rh.div>
    )
  ]
} as Meta<typeof NumberInputRoot>

export const Default: StoryObj<typeof NumberInputRoot> = {
  render: args => (
    <NumberInputRoot max={50} min={10} {...args}>
      <NumberInputInput />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
    </NumberInputRoot>
  )
}

export const Basic = {
  render: () => <BasicNumberInput />
}

export const Sizes = {
  render: () => <SizesNumberInput />
}

export const NumberInputHook = {
  render: (args: Record<string, unknown>) => <UseNumberInputExample {...args} />
}

export const FormatAndParse = {
  render: () => <FormatAndParseNumberInput />
}

export const WithMinAndMax = {
  render: () => <WithMinAndMaxNumberInput />
}

export const WithStep = {
  render: () => <WithStepNumberInput />
}

export const WithPrecision = {
  render: () => <WithPrecisionNumberInput />
}

export const WithClampValueDisabled = {
  render: () => <WithClampValueDisabledNumberInput />
}

export const AllowOutOfRange = {
  render: () => <AllowOutOfRangeNumberInput />
}

export const WithReactHookForm = {
  render: () => <WithReactHookFormNumberInput />
}

export const WithField = {
  render: () => <WithFieldNumberInput />
}
