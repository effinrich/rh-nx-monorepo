import { Locator, Page } from '@playwright/test'

export class ErrorPage {
  readonly page: Page
  readonly statusCode: Locator
  readonly heading: Locator
  readonly message: Locator
  readonly goBackBtn: Locator
  readonly takeMeHomeBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.statusCode = this.page.getByRole('heading')
    this.heading = this.page.locator('h1', { hasText: /error/ })
    this.message = this.page.getByRole('paragraph').last()
    this.goBackBtn = this.page.getByRole('button', { name: 'Go Back' })
    this.goBackBtn = this.page.getByRole('button', { name: 'Take me home' })
  }
}
