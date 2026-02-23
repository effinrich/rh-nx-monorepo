import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import { Textarea } from './textarea'

test('passes a11y test', async () => {
  await testA11y(<Textarea />, {
    axeOptions: {
      rules: {
        label: { enabled: false }
      }
    }
  })
})

test('Invalid input renders correctly', () => {
  render(<Textarea invalid />)

  expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
})

test('Disabled input renders correctly', () => {
  render(<Textarea disabled />)

  expect(screen.getByRole('textbox')).toBeDisabled()
})

test('Readonly input renders correctly', () => {
  render(<Textarea readOnly />)

  expect(screen.getByRole('textbox')).toHaveAttribute('aria-readonly', 'true')
})
