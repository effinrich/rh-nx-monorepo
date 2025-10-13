import { expect } from '@playwright/test'
import { wait } from '../../../../../../utils/platform/utils'

export async function filterNotes(notestab, field, value) {
  await notestab.filterNotes(field, value)
  await wait(500)
  await expect(notestab.loadingSpinner).not.toBeVisible()
  const count = await notestab.resultsCount()
  expect.soft(count).toBeGreaterThanOrEqual(1)
  return count
}
