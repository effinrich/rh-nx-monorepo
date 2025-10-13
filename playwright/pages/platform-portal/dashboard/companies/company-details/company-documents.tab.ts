import { Locator, Page } from '@playwright/test'

export class CompanyDocuments {
  readonly page: Page
  readonly tabPanel: Locator

  constructor(page: Page, tabPanel: Locator) {
    this.page = page
    this.tabPanel = tabPanel
  }
}
