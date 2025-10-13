import { Page } from '@playwright/test'

export class SignInPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/sign-in')
  }

  async signIn(email: string) {
    const popupPromise = this.page.waitForEvent('popup')
    const frame = await this.page.frameLocator(
      '[title = "Sign in with Google Button"]'
    )
    const button = await frame.getByRole('button')
    await button.click({ delay: 1000 })
    await button.click({ delay: 1000 })
    await button.click({ delay: 1000 })
    const popup = await popupPromise
    await popup.waitForLoadState()
    await popup.getByText(email).first().click()
  }
}
