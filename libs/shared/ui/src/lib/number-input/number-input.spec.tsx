import {
  hooks,
  render,
  screen,
  testA11y
} from '@redesignhealth/shared-utils-jest'

import { FieldHelperText, FieldLabel, FieldRoot } from '../../index'

import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot,
  NumberInputRootProps,
  useNumberInput
} from './number-input'

function renderComponent(props: NumberInputRootProps = {}) {
  return render(
    <>
      <label htmlFor="input">Select number:</label>
      <NumberInputRoot id="input" data-testid="root" {...props}>
        <NumberInputInput data-testid="input" />
        <NumberInputControl data-testid="group">
          <NumberInputIncrementTrigger children="+" data-testid="up-btn" />
          <NumberInputDecrementTrigger children="-" data-testid="down-btn" />
        </NumberInputControl>
      </NumberInputRoot>
    </>
  )
}

test.skip('passes a11y test', async () => {
  const { container } = renderComponent()
  await testA11y(container)
})

test('should start with empty string', () => {
  const { result } = hooks.render(() => useNumberInput())
  expect(result.current.value).toBe('')
})

test('should increment on press increment button', async () => {
  const { getByTestId, user } = renderComponent()

  const upBtn = getByTestId('up-btn')
  const input = getByTestId('input')

  await user.click(upBtn)
  expect(input).toHaveValue('1')

  await user.click(upBtn)
  expect(input).toHaveValue('2')
})

test('should call onValueChange on value change', async () => {
  const onValueChange = jest.fn()
  const { getByTestId, user } = renderComponent({ onValueChange })

  const upBtn = getByTestId('up-btn')

  await user.click(upBtn)

  expect(onValueChange).toHaveBeenCalled()
  expect(onValueChange).toHaveBeenCalledWith(
    expect.objectContaining({ value: '1', valueAsNumber: 1 })
  )
})

test('should derive invalid and required from surrounding FieldRoot', () => {
  render(
    <FieldRoot id="input" required invalid>
      <FieldLabel>Number</FieldLabel>
      <NumberInputRoot data-testid="root">
        <NumberInputInput data-testid="input" />
        <NumberInputControl data-testid="group">
          <NumberInputIncrementTrigger children="+" data-testid="up-btn" />
          <NumberInputDecrementTrigger children="-" data-testid="down-btn" />
        </NumberInputControl>
      </NumberInputRoot>
      <FieldHelperText>Select a number</FieldHelperText>
    </FieldRoot>
  )

  const input = screen.getByTestId('input')

  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toBeRequired()
})
