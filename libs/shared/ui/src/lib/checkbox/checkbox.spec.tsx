import * as React from 'react'
import {
  fireEvent,
  render,
  screen,
  testA11y
} from '@redesignhealth/shared-utils-jest'

import { FieldLabel, FieldRoot } from '../../index'

import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from './checkbox'

it('passes a11y test', async () => {
  await testA11y(
    <CheckboxRoot>
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>label</CheckboxLabel>
    </CheckboxRoot>
  )
})

test('Uncontrolled - should check and uncheck', async () => {
  const { user } = render(
    <CheckboxRoot>
      <CheckboxHiddenInput />
      <CheckboxControl data-testid="checkbox" />
      <CheckboxLabel>Checkbox</CheckboxLabel>
    </CheckboxRoot>
  )

  const input = screen.getByRole('checkbox', { hidden: true })
  const checkbox = screen.getByTestId('checkbox')

  await user.click(screen.getByText('Checkbox'))
  expect(input).toBeChecked()
  expect(checkbox).toHaveAttribute('data-state', 'checked')

  await user.click(screen.getByText('Checkbox'))
  expect(input).not.toBeChecked()
  expect(checkbox).not.toHaveAttribute('data-state', 'checked')
})

test('Uncontrolled - should not check if disabled', () => {
  render(
    <CheckboxRoot disabled>
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>Checkbox</CheckboxLabel>
    </CheckboxRoot>
  )

  const input = screen.getByRole('checkbox')
  const checkbox = screen.getByText('Checkbox')

  expect(input).toBeDisabled()
  expect(checkbox).toHaveAttribute('data-disabled')

  fireEvent.click(checkbox)

  expect(input).not.toBeChecked()
  expect(checkbox).not.toHaveAttribute('data-checked')
})

test('indeterminate state', () => {
  render(
    <CheckboxRoot checked="indeterminate">
      <CheckboxHiddenInput />
      <CheckboxControl data-testid="checkbox" />
      <CheckboxLabel>Checkbox</CheckboxLabel>
    </CheckboxRoot>
  )

  expect(screen.getByTestId('checkbox')).toHaveAttribute(
    'data-state',
    'indeterminate'
  )
})

test('Controlled - should check and uncheck', async () => {
  const onCheckedChange = jest.fn()

  const Component = () => {
    const [checked, setChecked] = React.useState(false)

    return (
      <CheckboxRoot
        checked={checked}
        onCheckedChange={event => {
          setChecked(!!event.checked)
          onCheckedChange(event)
        }}
      >
        <CheckboxHiddenInput />
        <CheckboxControl data-testid="checkbox" />
        <CheckboxLabel>Checkbox</CheckboxLabel>
      </CheckboxRoot>
    )
  }

  const { user } = render(<Component />)
  const checkbox = screen.getByTestId('checkbox')

  expect(checkbox).not.toHaveAttribute('data-state', 'checked')

  await user.click(screen.getByText('Checkbox'))
  expect(checkbox).toHaveAttribute('data-state', 'checked')
  expect(onCheckedChange).toHaveBeenCalled()
})

test('CheckboxGroup Uncontrolled - default values should be check', () => {
  const Component = () => (
    <CheckboxGroup defaultValue={['one', 'two']}>
      <CheckboxRoot value="one">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>One</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot value="two">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Two</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot value="three">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Three</CheckboxLabel>
      </CheckboxRoot>
    </CheckboxGroup>
  )
  const { container } = render(<Component />)
  const checkboxOne = container.querySelectorAll('input')[0]
  const checkboxTwo = container.querySelectorAll('input')[1]
  const checkboxThree = container.querySelectorAll('input')[2]

  expect(checkboxOne).toBeChecked()
  expect(checkboxTwo).toBeChecked()
  expect(checkboxThree).not.toBeChecked()

  fireEvent.click(checkboxThree)

  expect(checkboxOne).toBeChecked()
  expect(checkboxTwo).toBeChecked()
  expect(checkboxThree).toBeChecked()
})

test('Controlled CheckboxGroup', async () => {
  const Component = () => {
    const [value, setValue] = React.useState(['one', 'two'])
    return (
      <CheckboxGroup value={value} onValueChange={setValue}>
        <CheckboxRoot value="one">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>One</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="two">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Two</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="three">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Three</CheckboxLabel>
        </CheckboxRoot>
      </CheckboxGroup>
    )
  }

  const { user, container } = render(<Component />)
  const [checkboxOne, checkboxTwo, checkboxThree] = Array.from(
    container.querySelectorAll('input')
  )

  expect(checkboxOne).toBeChecked()
  expect(checkboxTwo).toBeChecked()
  expect(checkboxThree).not.toBeChecked()

  await user.click(screen.getByText('Three'))

  expect(checkboxOne).toBeChecked()
  expect(checkboxTwo).toBeChecked()
  expect(checkboxThree).toBeChecked()
})

test('Uncontrolled CheckboxGroup - should not check if group disabled', () => {
  const { container } = render(
    <CheckboxGroup disabled>
      <CheckboxRoot value="one">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>One</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot value="two">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Two</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot value="three">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Three</CheckboxLabel>
      </CheckboxRoot>
    </CheckboxGroup>
  )
  const [checkboxOne, checkboxTwo, checkboxThree] = Array.from(
    container.querySelectorAll('input')
  )

  expect(checkboxOne).toBeDisabled()
  expect(checkboxTwo).toBeDisabled()
  expect(checkboxThree).toBeDisabled()
})

test('uncontrolled CheckboxGroup handles change', async () => {
  const onValueChange = jest.fn()
  const { user } = render(
    <CheckboxGroup defaultValue={['A', 'C']} onValueChange={onValueChange}>
      <CheckboxRoot value="A">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>A</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot value="B">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>B</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot value="C">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>C</CheckboxLabel>
      </CheckboxRoot>
    </CheckboxGroup>
  )

  await user.click(screen.getByText('B'))

  expect(onValueChange).toHaveBeenCalledTimes(1)
  expect(onValueChange).toHaveBeenCalledWith(['A', 'C', 'B'])
})

test('can pass tabIndex directly to input component', () => {
  const { container } = render(
    <>
      <Checkbox inputProps={{ tabIndex: -1 }}>
        Not Focusable with provided tabIndex
      </Checkbox>
      <Checkbox>Not Focusable</Checkbox>
    </>
  )
  const [checkboxOne, checkboxTwo] = Array.from(
    container.querySelectorAll('input')
  )

  expect(checkboxOne).toHaveAttribute('tabIndex', '-1')
  expect(checkboxTwo).not.toHaveAttribute('tabIndex')
})

test('CheckboxGroup can toggle string values', async () => {
  const Group = () => {
    const [value, setValue] = React.useState<string[]>(['2', '3'])

    return (
      <div>
        <p id="value">{value.sort().join(', ')}</p>
        <CheckboxGroup value={value} onValueChange={setValue}>
          <CheckboxRoot value="1">
            <CheckboxHiddenInput />
            <CheckboxControl />
            <CheckboxLabel>One</CheckboxLabel>
          </CheckboxRoot>
          <CheckboxRoot value="2">
            <CheckboxHiddenInput />
            <CheckboxControl />
            <CheckboxLabel>Two</CheckboxLabel>
          </CheckboxRoot>
          <CheckboxRoot value="3">
            <CheckboxHiddenInput />
            <CheckboxControl />
            <CheckboxLabel>Three</CheckboxLabel>
          </CheckboxRoot>
        </CheckboxGroup>
      </div>
    )
  }

  const { user, container } = render(<Group />)

  const [checkboxOne, checkboxTwo, checkboxThree] = Array.from(
    container.querySelectorAll('input')
  )

  const values = container.querySelector('p')

  expect(values?.innerHTML).toMatch('2, 3')
  expect(checkboxOne).not.toBeChecked()
  expect(checkboxTwo).toBeChecked()
  expect(checkboxThree).toBeChecked()

  await user.click(screen.getByText('One'))
  expect(values?.innerHTML).toMatch('1, 2, 3')
  expect(checkboxOne).toBeChecked()
  expect(checkboxTwo).toBeChecked()
  expect(checkboxThree).toBeChecked()
})

test('CheckboxGroup invalid marks items', () => {
  const { container } = render(
    <CheckboxGroup invalid>
      <CheckboxRoot value="1">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Invalid Opt-in 1</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot value="2">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Invalid Opt-in 2</CheckboxLabel>
      </CheckboxRoot>
    </CheckboxGroup>
  )

  const [checkboxOne, checkboxTwo] = Array.from(
    container.querySelectorAll('input')
  )

  expect(checkboxOne).toHaveAttribute('aria-invalid', 'true')
  expect(checkboxTwo).toHaveAttribute('aria-invalid', 'true')
})

test('Uncontrolled FieldRoot - mark label required', () => {
  const { container } = render(
    <FieldRoot required mt={4}>
      <FieldLabel>Required Opt-in Example</FieldLabel>
      <CheckboxGroup>
        <CheckboxRoot value="1">
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Required Opt-in 1</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="2" required>
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Required Opt-in 2</CheckboxLabel>
        </CheckboxRoot>
        <CheckboxRoot value="3" required={false}>
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>Required Opt-in 3</CheckboxLabel>
        </CheckboxRoot>
      </CheckboxGroup>
    </FieldRoot>
  )

  const [checkboxOne, checkboxTwo, checkboxThree] = Array.from(
    container.querySelectorAll('input')
  )

  expect(checkboxOne).toBeRequired()
  expect(checkboxTwo).toBeRequired()
  expect(checkboxThree).not.toBeRequired()
})

test('CheckboxGroup readOnly marks items', () => {
  render(
    <CheckboxGroup readOnly>
      <CheckboxRoot value="1">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>ReadOnly Opt-in 1</CheckboxLabel>
      </CheckboxRoot>
    </CheckboxGroup>
  )

  expect(screen.getByText('ReadOnly Opt-in 1')).toHaveAttribute('data-readonly')
})

test('Uncontrolled FieldRoot - calls all onFocus EventHandler', () => {
  const formControlOnFocusMock = jest.fn()
  const checkboxOnFocusMock = jest.fn()

  const { container } = render(
    <FieldRoot mt={4} onFocus={formControlOnFocusMock}>
      <FieldLabel>onFocus xample</FieldLabel>
      <CheckboxGroup>
        <CheckboxRoot value="1" onFocus={checkboxOnFocusMock}>
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>onFocus Opt-in 1</CheckboxLabel>
        </CheckboxRoot>
      </CheckboxGroup>
    </FieldRoot>
  )

  const [checkboxOne] = Array.from(container.querySelectorAll('input'))
  fireEvent.focus(checkboxOne)
  expect(formControlOnFocusMock).toHaveBeenCalled()
  expect(checkboxOnFocusMock).toHaveBeenCalled()
})

test('Uncontrolled FieldRoot - calls all onBlur EventHandler', () => {
  const formControlOnBlurMock = jest.fn()
  const checkboxOnBlurMock = jest.fn()

  const { container } = render(
    <FieldRoot mt={4} onBlur={formControlOnBlurMock}>
      <FieldLabel>onBlur Example</FieldLabel>
      <CheckboxGroup>
        <CheckboxRoot value="1" onBlur={checkboxOnBlurMock}>
          <CheckboxHiddenInput />
          <CheckboxControl />
          <CheckboxLabel>onBlur EOpt-in 1</CheckboxLabel>
        </CheckboxRoot>
      </CheckboxGroup>
    </FieldRoot>
  )

  const [checkboxOne] = Array.from(container.querySelectorAll('input'))
  fireEvent.focus(checkboxOne)
  fireEvent.blur(checkboxOne)
  expect(formControlOnBlurMock).toHaveBeenCalled()
  expect(checkboxOnBlurMock).toHaveBeenCalled()
})

test('On reseting form, checkbox should reset to its default state i.e., checked', () => {
  const { getByRole } = render(
    <form>
      <label htmlFor="myCheckbox">My Checkbox</label>
      <CheckboxRoot id="myCheckbox" defaultChecked>
        <CheckboxHiddenInput />
        <CheckboxControl />
      </CheckboxRoot>
      <button type="reset">Reset</button>
    </form>
  )
  const resetBtn = getByRole('button')
  const checkbox = getByRole('checkbox')
  fireEvent.click(checkbox)
  fireEvent.click(resetBtn)
  expect(checkbox).toBeChecked()
})

test('On reseting form, checkbox should reset to its default state i.e., unchecked', () => {
  const { getByRole } = render(
    <form>
      <label htmlFor="myCheckbox">My Checkbox</label>
      <CheckboxRoot id="myCheckbox">
        <CheckboxHiddenInput />
        <CheckboxControl />
      </CheckboxRoot>
      <button type="reset" name="resetBtn">
        Reset
      </button>
    </form>
  )
  const resetBtn = getByRole('button')
  const checkbox = getByRole('checkbox')
  fireEvent.click(checkbox)
  fireEvent.click(resetBtn)
  expect(checkbox).not.toBeChecked()
})
