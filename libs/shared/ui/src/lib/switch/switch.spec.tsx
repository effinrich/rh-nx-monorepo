import * as React from 'react'
import { fireEvent, render } from '@redesignhealth/shared-utils-jest'

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
  const ControlledSwitch = ({ onChange }: any) => {
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

test('Uncontrolled FieldRoot - should not check if form-control disabled', async () => {
  const { container, user } = render(
    <FieldRoot disabled mt={4}>
      <FieldLabel>Disabled Opt-in Example</FieldLabel>
      <Switch />
      <Switch disabled />
      <Switch disabled={false} />
    </FieldRoot>
  )

  const [switchOne, switchTwo, switchThree] = Array.from(
    container.querySelectorAll('input')
  )

  expect(switchOne).toBeDisabled()
  expect(switchTwo).toBeDisabled()
  expect(switchThree).toBeEnabled()

  await user.click(switchOne)
  await user.click(switchTwo)
  await user.click(switchThree)

  expect(switchOne).not.toBeChecked()
  expect(switchTwo).not.toBeChecked()
  expect(switchThree).toBeChecked()
})

test('Uncontrolled FieldRoot - mark label as invalid', () => {
  const { container } = render(
    <FieldRoot invalid mt={4}>
      <FieldLabel>Invalid Opt-in Example</FieldLabel>
      <Switch>Invalid Opt-in 1</Switch>
      <Switch invalid>Invalid Opt-in 2</Switch>
      <Switch invalid={false}>Invalid Opt-in 3</Switch>
    </FieldRoot>
  )

  const [switchOne, switchTwo, switchThree] = Array.from(
    container.querySelectorAll('input')
  )

  expect(switchOne).toHaveAttribute('aria-invalid', 'true')
  expect(switchTwo).toHaveAttribute('aria-invalid', 'true')
  expect(switchThree).toHaveAttribute('aria-invalid', 'false')

  const [labelOne, labelTwo, labelThree] = Array.from(
    container.querySelectorAll('span.chakra-switch__label')
  )

  expect(labelOne).toHaveAttribute('data-invalid', '')
  expect(labelTwo).toHaveAttribute('data-invalid', '')
  expect(labelThree).not.toHaveAttribute('data-invalid')

  const [controlOne, controlTwo, controlThree] = Array.from(
    container.querySelectorAll('span.chakra-switch__track')
  )

  expect(controlOne).toHaveAttribute('data-invalid', '')
  expect(controlTwo).toHaveAttribute('data-invalid', '')
  expect(controlThree).not.toHaveAttribute('data-invalid')
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
  const { container } = render(
    <FieldRoot readOnly mt={4}>
      <FieldLabel>ReadOnly Opt-in Example</FieldLabel>
      <Switch />
      <Switch readOnly />
      <Switch readOnly={false} />
    </FieldRoot>
  )

  const [switchOne, switchTwo, switchThree] = Array.from(
    container.querySelectorAll('input')
  )

  expect(switchOne).toHaveAttribute('readOnly')
  expect(switchTwo).toHaveAttribute('readOnly')
  expect(switchThree).not.toHaveAttribute('readOnly')

  const [controlOne, controlTwo, controlThree] = Array.from(
    container.querySelectorAll('span.chakra-switch__track')
  )

  expect(controlOne).toHaveAttribute('data-readonly', '')
  expect(controlTwo).toHaveAttribute('data-readonly', '')
  expect(controlThree).not.toHaveAttribute('data-readonly')
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
