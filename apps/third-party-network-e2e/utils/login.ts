import { Page } from '@playwright/test'

export const login = async (page: Page, initialURL = '/') => {
  const loginButton = page
    .frameLocator('internal:attr=[title="Sign in with Google Button"i]')
    .getByRole('button', { name: 'Sign in with Google' })
  const popupPromise = page.waitForEvent('popup')

  await page.goto(initialURL)
  await page.waitForURL('/login')
  await page.waitForTimeout(process.env.CI ? 3000 : 1000)
  await loginButton.click()

  const popup = await popupPromise
  const userLink = popup.getByRole('link').first()

  await popup.waitForLoadState()
  await userLink.click()
  await page.waitForURL(initialURL)
}
