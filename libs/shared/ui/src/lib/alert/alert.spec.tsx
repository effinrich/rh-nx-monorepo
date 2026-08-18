import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import {
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from './alert'

test('passes a11y test', async () => {
  await testA11y(
    <AlertRoot>
      <AlertIndicator />
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert description</AlertDescription>
    </AlertRoot>
  )
})

test("should have role='alert'", () => {
  render(
    <AlertRoot>
      <AlertIndicator />
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert description</AlertDescription>
    </AlertRoot>
  )

  expect(screen.getByRole('alert')).toBeInTheDocument()
})
