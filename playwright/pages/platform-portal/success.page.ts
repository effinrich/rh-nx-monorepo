import { Locator, Page } from '@playwright/test'

export class SuccessPage {
  readonly page: Page
  readonly checkmark: Locator
  readonly msg: Locator
  readonly requestMsg: Locator
  readonly viewBtn: Locator
  readonly addAnotherBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.checkmark = this.page.getByRole('img')
    this.msg = this.page.getByText(/added successfully/)
    this.requestMsg = this.page.getByText('User request submitted')
    this.viewBtn = this.page.getByRole('button', { name: /^View / })
    this.addAnotherBtn = this.page.getByRole('button', { name: /Add another / })
  }
}
