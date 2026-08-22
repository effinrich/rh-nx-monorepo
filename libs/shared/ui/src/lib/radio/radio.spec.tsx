import {
  fireEvent,
  render,
  screen,
  testA11y
} from '@redesignhealth/shared-utils-jest'

import { FieldHelperText, FieldLabel, FieldRoot } from '../../index'

import { Radio, RadioGroupRoot } from './radio'

it('passes a11y test', async () => {
  await testA11y(
    <RadioGroupRoot>
      <Radio value="one">One</Radio>
    </RadioGroupRoot>
  )
})

test('selects a radio on click', async () => {
  const { user } = render(
    <RadioGroupRoot>
      <Radio value="one">One</Radio>
      <Radio value="two">Two</Radio>
    </RadioGroupRoot>
  )

  const one = screen.getByRole('radio', { name: 'One' })
  const two = screen.getByRole('radio', { name: 'Two' })

  expect(one).not.toBeChecked()
  expect(two).not.toBeChecked()

  await user.click(screen.getByText('One'))
  expect(one).toBeChecked()
  expect(two).not.toBeChecked()
})

test('RadioGroupRoot marks items invalid and disabled', () => {
  const onFocus = jest.fn()
  const onBlur = jest.fn()

  render(
    <FieldRoot onFocus={onFocus} onBlur={onBlur}>
      <FieldLabel>Radio</FieldLabel>
      <RadioGroupRoot invalid disabled>
        <Radio value="Chakra UI">Chakra UI</Radio>
      </RadioGroupRoot>
      <FieldHelperText>Select a value</FieldHelperText>
    </FieldRoot>
  )

  const radio = screen.getByRole('radio', { hidden: true })

  expect(radio).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByText('Chakra UI').closest('[data-disabled]')).toBeTruthy()

  fireEvent.focus(radio)
  expect(onFocus).toHaveBeenCalled()

  fireEvent.blur(radio)
  expect(onBlur).toHaveBeenCalled()
})
