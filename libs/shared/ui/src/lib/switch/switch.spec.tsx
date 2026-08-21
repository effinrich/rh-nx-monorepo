import * as React from 'react'
import { fireEvent, render, screen } from '@redesignhealth/shared-utils-jest'

import { FieldLabel, FieldRoot } from '../form-control/form-control'

import { Switch } from './switch'

test('Uncontrolled - should check and uncheck', async () => {
  const { container, user } = render(<Switch />)
  const input = container.querySelector('input') as HTMLInputElement

  await user.click(input)
  expect(input).toBeChecked()

  await user.click(input)
  expect(input).not.toBeChecked()
})

test('Uncontrolled - should not check if disabled', async () => {
  const { container, user } = render(<Switch disabled />)
  const input = container.querySelector('input') as HTMLInputElement

  expect(input).toBeDisabled()

  await user.click(input)
  expect(input).not.toBeChecked()
})

test('Controlled - should check and uncheck', async () => {
  const ControlledSwitch = ({ onChange }: { onChange?: () => void }) => {
    const [checked, setChecked] = React.useState(false)
    return (
      <Switch
        checked={checked}
        onCheckedChange={e => {
          onChange?.()
          setChecked(e.checked === true)
        }}
      />
    )
  }

  const onChange = jest.fn()

  const { container, user } = render(<ControlledSwitch onChange={onChange} />)

  const input = container.querySelector('input') as HTMLInputElement

  expect(input).not.toBeChecked()

  await user.click(input)

  expect(input).toBeChecked()
  expect(onChange).toHaveBeenCalled()

  await user.click(input)

  expect(input).not.toBeChecked()
  expect(onChange).toHaveBeenCalled()
})

test('Uncontrolled FieldRoot - should not check if form-control disabled', () => {
  const { container } = render(
    <FieldRoot disabled mt={4}>
      <FieldLabel>Disabled Opt-in Example</FieldLabel>
      <Switch />
    </FieldRoot>
  )

  const input = container.querySelector('input') as HTMLInputElement
  expect(input).toBeDisabled()
})

test('Uncontrolled FieldRoot - mark switch as invalid', () => {
  const { container } = render(
    <FieldRoot invalid mt={4}>
      <FieldLabel>Invalid Opt-in Example</FieldLabel>
      <Switch>Invalid Opt-in</Switch>
    </FieldRoot>
  )

  const input = container.querySelector('input') as HTMLInputElement
  expect(input).toHaveAttribute('aria-invalid', 'true')
})

test('Uncontrolled FieldRoot - mark required', () => {
  const { container } = render(
    <FieldRoot required mt={4}>
      <FieldLabel>Required Opt-in Example</FieldLabel>
      <Switch />
      <Switch required />
      <Switch required={false} />
    </FieldRoot>
  )

  const [switchOne, switchTwo, switchThree] = Array.from(
    container.querySelectorAll('input')
  )

  expect(switchOne).toBeRequired()
  expect(switchTwo).toBeRequired()
  expect(switchThree).not.toBeRequired()
})

test('Uncontrolled FieldRoot - mark readonly', () => {
  render(
    <FieldRoot readOnly mt={4}>
      <FieldLabel>ReadOnly Opt-in Example</FieldLabel>
      <Switch>ReadOnly Opt-in</Switch>
    </FieldRoot>
  )

  expect(screen.getByText('ReadOnly Opt-in')).toHaveAttribute('data-readonly')
})

test('Uncontrolled FieldRoot - calls all onFocus EventHandler', () => {
  const formControlOnFocusMock = jest.fn()
  const switchOnFocusMock = jest.fn()

  const { container } = render(
    <FieldRoot mt={4} onFocus={formControlOnFocusMock}>
      <FieldLabel>onFocus Example</FieldLabel>
      <Switch onFocus={switchOnFocusMock} />
    </FieldRoot>
  )

  const [switchOne] = Array.from(container.querySelectorAll('input'))
  fireEvent.focus(switchOne)
  expect(formControlOnFocusMock).toHaveBeenCalled()
  expect(switchOnFocusMock).toHaveBeenCalled()
})

test('Uncontrolled FieldRoot - calls all onBlur EventHandler', () => {
  const formControlOnBlurMock = jest.fn()
  const switchOnBlurMock = jest.fn()

  const { container } = render(
    <FieldRoot mt={4} onBlur={formControlOnBlurMock}>
      <FieldLabel>onBlur Example</FieldLabel>
      <Switch onBlur={switchOnBlurMock} />
    </FieldRoot>
  )

  const [switchOne] = Array.from(container.querySelectorAll('input'))
  fireEvent.focus(switchOne)
  fireEvent.blur(switchOne)
  expect(formControlOnBlurMock).toHaveBeenCalled()
  expect(switchOnBlurMock).toHaveBeenCalled()
})
