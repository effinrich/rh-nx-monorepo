import { Meta } from '@storybook/react-vite'

import { Container } from '../../index'

import { BasicUsageSelect } from './partials/basic-usage-select'
import { FocusAndErrorColorsSelect } from './partials/focus-and-error-colors-select'
import { OverrideStylesSelect } from './partials/override-styles-select'
import { SelectControlledSelect } from './partials/select-controlled-select'
import { SelectSizesSelect } from './partials/select-sizes-select'
import { SelectStatesSelect } from './partials/select-states-select'
import { SelectVariantsSelect } from './partials/select-variants-select'
import { NativeSelectRoot } from './select'

export default {
  component: NativeSelectRoot,
  title: 'Components / Forms / Select',
  decorators: [
    (story: () => unknown) => (
      <Container maxWidth="400px" mt="40px">
        {story()}
      </Container>
    )
  ]
} as Meta

export const BasicUsage = {
  render: () => <BasicUsageSelect />
}

export const SelectStates = {
  render: () => <SelectStatesSelect />
}

export const SelectVariants = {
  render: () => <SelectVariantsSelect />
}

export const SelectSizes = {
  render: () => <SelectSizesSelect />
}

export const SelectControlled = {
  render: () => <SelectControlledSelect />
}

export const FocusAndErrorColors = {
  render: () => <FocusAndErrorColorsSelect />
}

export const OverrideStyles = {
  render: () => <OverrideStylesSelect />
}
