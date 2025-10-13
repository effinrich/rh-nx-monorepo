import { expect, test } from '@playwright/test'

import { login } from '../../utils/login'

test.describe('/login', () => {
  test('Title contains "Log In"', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle('RH Advise | Log In')
  })

  test('Logo contains "Redesign Health"', async ({ page }) => {
    const image = page.getByAltText('Redesign Health')

    await page.goto('/login')
    await expect(image).toBeVisible()
  })

  test('Login', async ({ page }) => {
    await login(page, '/')
    await expect(page).toHaveURL('/')
  })

  test('Redirect after login', async ({ page }) => {
    await login(page, '/random-page')
    await expect(page).toHaveURL('/random-page')
  })

  test('Redirect to "/" if trying to navigate to "/login" after successful login', async ({
    page
  }) => {
    await login(page)
    await page.goto('/login')
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })

  test('Logout', async ({ page }) => {
    const logoutMenuItem = page.getByRole('menuitem', { name: 'Log Out' })
    const menu = page.locator('button[aria-haspopup="menu"]', {
      hasText: /[A-Z]{2}/
    })

    await login(page)
    await menu.click()
    await logoutMenuItem.click()
    await expect(page).toHaveURL('/login')
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })
})
