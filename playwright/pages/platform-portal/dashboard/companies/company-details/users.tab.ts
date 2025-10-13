import { Locator, Page } from '@playwright/test'

export class Users {
  readonly page: Page
  readonly tabPanel: Locator
  readonly loadingSpinner: Locator
  readonly addUserBtn: Locator

  constructor(page: Page, tabPanel: Locator) {
    this.page = page
    this.tabPanel = tabPanel
    this.loadingSpinner = this.tabPanel.getByText('Loading...')
    this.addUserBtn = this.tabPanel.getByRole('link', { name: 'Add user' })
  }
}
