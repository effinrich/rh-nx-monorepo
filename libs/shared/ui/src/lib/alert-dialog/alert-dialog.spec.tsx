import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import { BasicUsageFixture } from './partials/basic-usage-fixture'

it('renders no ui when closed', () => {
  render(<BasicUsageFixture />)

  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
})

it("renders an element with role='alertdialog' when opened", () => {
  render(<BasicUsageFixture open />)

  expect(screen.getByRole('alertdialog')).toBeInTheDocument()
})

it('passes a11y test closed', async () => {
  await testA11y(<BasicUsageFixture />)
})

it('passes a11y test opened', async () => {
  await testA11y(<BasicUsageFixture open />)
})
