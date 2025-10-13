import { expect, Locator, Page } from '@playwright/test'
import { wait } from '../../../../../utils/platform/utils'

export class EditCompanyForm {
  readonly page: Page
  readonly modal: Locator
  readonly heading: Locator
  readonly subheading: Locator
  readonly xcloseBtn: Locator
  readonly internalName: Locator
  readonly coNumber: Locator
  readonly legalName: Locator
  readonly description: Locator
  readonly cancelBtn: Locator
  readonly submitBtn: Locator
  readonly errorMsgs: Locator

  constructor(page: Page) {
    this.page = page
    this.modal = this.page.locator('.chakra-modal__content')
    this.heading = this.modal.locator('header')
    this.subheading = this.modal.locator('p:nth-of-type(2)')
    this.xcloseBtn = this.modal.getByRole('button', { name: 'Close' })
    this.internalName = this.modal.locator('[name="name"]')
    this.coNumber = this.modal.locator('[name="number"]')
    this.legalName = this.modal.locator('[name="legalName"]')
    this.description = this.modal.locator('[name="description"]')
    this.cancelBtn = this.modal.getByRole('button', { name: 'Cancel' })
    this.submitBtn = this.modal.getByRole('button', { name: 'Save' })
    this.errorMsgs = this.modal.locator('.chakra-form__error-message')
  }
  async editCompany(input) {
    await this.fillout(input)
    await this.submit()
  }
  async fillout(input) {
    if (input.name) {
      await this.internalName.fill(input.name)
    }
    if (input.internalName) {
      await this.internalName.fill(input.internalName)
    }
    if (input.number) {
      await this.coNumber.fill(input.number)
    }
    if (input.legalName) {
      await this.legalName.fill(input.legalName)
    }
    if (input.description) {
      await this.description.fill(input.description)
    }
  }
  async getErrorMsg(fieldLabel) {
    return await this.modal
      .locator('[role="group"]', { hasText: fieldLabel })
      .locator('.chakra-form__error-message')
  }
  async goto(coId) {
    await this.page.goto(`/companies/${coId}/overview/edit`)
    await wait(500)
    await expect(this.internalName).not.toHaveAttribute('value', '')
  }
  async submit() {
    await this.submitBtn.click({ position: { x: 10, y: 10 }})
  }
}
