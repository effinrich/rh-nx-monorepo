import { expect, userEvent, within } from 'storybook/test'

import { Meta } from '@storybook/react-vite'

import { Container } from '../../index'

import { BasicRadio } from './partials/basic-radio'
import { DisabledRadio } from './partials/disabled-radio'
import { DisabledRadioGroupRadio } from './partials/disabled-radio-group-radio'
import { GroupWithSimpleGridRadio } from './partials/group-with-simple-grid-radio'
import { GroupWithStackRadio } from './partials/group-with-stack-radio'
import { GroupWithWrapRadio } from './partials/group-with-wrap-radio'
import { InteractiveRadio } from './partials/interactive-radio'
import { RadioGroupRadio } from './partials/radio-group-radio'
import { ReadonlyRadio } from './partials/readonly-radio'
import { WithSizesRadio } from './partials/with-sizes-radio'
import { Radio } from './radio'

export default {
  component: Radio,
  title: 'Components / Forms / Radio',
  decorators: [
    (story: () => unknown) => <Container mt="40px">{story()}</Container>
  ]
} as Meta<typeof Radio>

export const Basic = {
  render: () => <BasicRadio />
}

export const Disabled = {
  render: () => <DisabledRadio />
}

export const Readonly = {
  render: () => <ReadonlyRadio />
}

export const Interactive = {
  render: () => <InteractiveRadio />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('One'))
    await expect(canvas.getByRole('radio', { name: 'One' })).toBeChecked()
  }
}

export const WithSizes = {
  render: () => <WithSizesRadio />
}

export const _RadioGroup = {
  render: () => <RadioGroupRadio />
}

export const GroupWithStack = {
  render: () => <GroupWithStackRadio />
}

export const GroupWithWrap = {
  render: () => <GroupWithWrapRadio />
}

export const GroupWithSimpleGrid = {
  render: () => <GroupWithSimpleGridRadio />
}

export const DisabledRadioGroup = {
  render: () => <DisabledRadioGroupRadio />
}
