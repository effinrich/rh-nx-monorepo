import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import { Alert, AlertDescription, AlertIcon, AlertTitle } from './alert'

test('passes a11y test', async () => {
  await testA11y(
    <Alert>
      <AlertIcon />
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert description</AlertDescription>
    </Alert>
  )
})

test("should have role='alert'", () => {
  render(
    <Alert>
      <AlertIcon />
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert description</AlertDescription>
    </Alert>
  )

  expect(screen.getByRole('alert')).toBeInTheDocument()
})
