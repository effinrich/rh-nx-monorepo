import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import { CloseButton } from './close-button'

test('passes a11y test', async () => {
  await testA11y(<CloseButton />)
})

test('has the proper aria attributes', () => {
  render(<CloseButton />)
  expect(screen.getByLabelText('Close')).toBeInTheDocument()
})
