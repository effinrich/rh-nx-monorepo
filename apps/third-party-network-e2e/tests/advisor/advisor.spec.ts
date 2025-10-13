import { expect, test } from '@playwright/test'

import { advisor } from '../../constants/advisor'
import { login } from '../../utils/login'

/* TODO: Skip until test database is created to have a advisor to test against*/
test.describe.skip('/{advisorId}', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, `/${advisor.id}`)
  })

  test('Title contains advisor name', async ({ page }) => {
    await expect(page).toHaveTitle(`RH Advise | ${advisor.name}`)
  })

  test('Advisor name is visible', async ({ page }) => {
    const advisorName = page.getByText(advisor.name)

    await expect(advisorName).toBeVisible()
  })

  test('Navigate to request contract', async ({ page }) => {
    const contractLink = page.getByRole('link', {
      name: 'Request Contract'
    })
    const contractPagePromise = page.waitForEvent('popup')

    await contractLink.click()

    const contractPage = await contractPagePromise
    await contractPage.waitForLoadState()

    await expect(contractPage).toHaveURL(/typeform/)
  })

  test('Opens form to request introduction', async ({ page }) => {
    const formButton = page.getByRole('button', {
      name: 'Request Introduction'
    })
    const form = page.getByRole('dialog')
    const formTitle = form.locator('header', {
      hasText: 'Request Introduction'
    })

    await formButton.click()
    await expect(form).toBeVisible()
    await expect(formTitle).toBeVisible()
  })
})
