import { Meta } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Container } from '../../index'

import { BaseSwitch } from './partials/base-switch'
import { ControlledSwitch } from './partials/controlled-switch'
import { DisabledSwitch } from './partials/disabled-switch'
import { InteractiveSwitch } from './partials/interactive-switch'
import { InvalidSwitch } from './partials/invalid-switch'
import { ReadonlySwitch } from './partials/readonly-switch'
import { SizesSwitch } from './partials/sizes-switch'
import { StateDependingBehaviorSwitch } from './partials/state-depending-behavior-switch'
import { UsageSwitch } from './partials/usage-switch'
import { WithFieldSwitch } from './partials/with-field-switch'
import { WithReactHookFormSwitch } from './partials/with-react-hook-form-switch'
import { Switch } from './switch'

export default {
  title: 'Components / Forms / Switch',
  component: Switch,
  decorators: [
    (Story: () => unknown) => (
      <Container maxWidth="lg" mx="auto" mt={6} p={6}>
        <Story />
      </Container>
    )
  ]
} as Meta

export const Base = {
  render: () => <BaseSwitch />
}

export const Interactive = {
  render: () => <InteractiveSwitch />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('switch', { hidden: true })
    await expect(input).not.toBeChecked()
    await userEvent.click(input)
    await expect(input).toBeChecked()
  }
}

export const Disabled = {
  render: () => <DisabledSwitch />
}

export const Readonly = {
  render: () => <ReadonlySwitch />
}

export const Invalid = {
  render: () => <InvalidSwitch />
}

export const Usage = {
  render: () => <UsageSwitch />
}

export const Sizes = {
  render: () => <SizesSwitch />
}

export const Controlled = {
  render: () => <ControlledSwitch />
}

export const StateDependingBehavior = {
  render: () => <StateDependingBehaviorSwitch />
}

export const WithReactHookForm = {
  render: () => <WithReactHookFormSwitch />
}

export const WithField = {
  render: () => <WithFieldSwitch />
}
