import { expect, test } from '@playwright/test'

import { advisor } from '../../constants/advisor'
import { login } from '../../utils/login'

test.describe('/', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('Title contains "Home"', async ({ page }) => {
    await expect(page).toHaveTitle('RH Advise | Home')
  })

  test('30 cards per page', async ({ page }) => {
    const card = page.locator('div[aria-label="card"]')

    await expect(card).toHaveCount(30)
  })

  /* TODO: Skip until test database is created to have a advisor to test against*/
  test.skip('Search advisor', async ({ page }) => {
    const input = page.getByLabel(/search/i)
    const card = page.locator('div[aria-label="card"]', {
      hasText: advisor.name
    })
    const avatar = card.locator('div[role="img"]', {
      hasText: advisor.initials
    })

    await input.type(advisor.name)
    await expect(card).toBeVisible()
    await expect(avatar).toBeVisible()
  })

  test.describe('Filter', () => {
    for (const filterName of ['Category', 'Tag', 'OpCo Engagements']) {
      test(`"${filterName}"`, async ({ page }) => {
        const card = page.locator('div[aria-label="card"]')
        const filter = page.getByRole('group').filter({ hasText: filterName })
        const option = filter.getByRole('button').first()

        await filter.click()

        const optionValue = await option.innerText()

        await option.click()
        await expect(card).toContainText([optionValue])
      })
    }
  })

  test.describe('Menu', () => {
    test('Navigate to advisor details page', async ({ page }) => {
      const card = page.locator('div[aria-label="card"]').first()
      const menu = card.locator('button[aria-haspopup="menu"]')
      const detailsLink = card.getByRole('menuitem', { name: 'See bio' })
      const name = await card
        .locator('div[role="img"]')
        .getAttribute('aria-label')

      await menu.click()
      await detailsLink.click()

      const advisorName = page.getByText(name as string)

      await expect(page).toHaveTitle(`RH Advise | ${name}`)
      await expect(advisorName).toBeVisible()
    })

    test('Navigate to request contract', async ({ page }) => {
      const card = page.locator('div[aria-label="card"]').first()
      const menu = card.locator('button[aria-haspopup="menu"]')
      const contractLink = card.getByRole('menuitem', {
        name: 'Request contract'
      })
      const contractPagePromise = page.waitForEvent('popup')

      await menu.click()
      await contractLink.click()

      const contractPage = await contractPagePromise

      await contractPage.waitForLoadState()
      await expect.soft(contractPage).toHaveURL(/typeform/)
    })

    test('Open form to request introduction', async ({ page }) => {
      const card = page.locator('div[aria-label="card"]').first()
      const menu = card.locator('button[aria-haspopup="menu"]')
      const formLink = card.getByRole('menuitem', {
        name: 'Request introduction'
      })
      const form = page.getByRole('dialog')
      const formTitle = form.locator('header', {
        hasText: 'Request Introduction'
      })

      await menu.click()
      await formLink.click()
      await expect(form).toBeVisible()
      await expect(formTitle).toBeVisible()
    })
  })
})
