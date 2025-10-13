import { Locator, Page } from '@playwright/test'
import { CEOForm } from './base.form'

export class AddCEOForm extends CEOForm {
  readonly addCEOBtn: Locator

  constructor(page: Page) {
    super(page)
    this.addCEOBtn = this.mainPanel
      .locator('footer')
      .getByRole('button', { name: 'Add CEO', exact: true })
  }

  async addCEO(input: CEOCommand) {
    await this.fillout(input)
    await this.submit()
  }

  async goto() {
    await this.page.goto('/ceo-directory/add')
  }

  async submit() {
    await this.addCEOBtn.click()
  }
}
