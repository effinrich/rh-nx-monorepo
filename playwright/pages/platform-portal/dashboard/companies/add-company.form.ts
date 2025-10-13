import { Locator, Page } from '@playwright/test'

export class AddCompanyForm {
  readonly page: Page
  readonly modal: Locator
  readonly heading: Locator
  readonly subheading: Locator
  readonly xcloseBtn: Locator
  readonly internalName: Locator
  readonly coNumber: Locator
  readonly legalName: Locator
  readonly stage: Locator
  readonly description: Locator
  readonly signedPlatformAgreement: Locator
  readonly cancelBtn: Locator
  readonly addCompanyBtn: Locator
  readonly errorMsgs: Locator

  constructor(page: Page) {
    this.page = page
    this.modal = page.locator('.chakra-modal__content')
    this.heading = this.modal.locator('.chakra-modal__header')
    this.subheading = this.modal.locator('chakra-modal__header p')
    this.xcloseBtn = this.modal.getByRole('button', { name: 'Close' })
    this.internalName = this.modal.locator('[name="name"]')
    this.coNumber = this.modal.locator('[name="number"]')
    this.stage = this.modal.locator('[name="stage"]')
    this.legalName = this.modal.locator('[name="legalName"]')
    this.description = this.modal.locator('[name="description"]')
    this.signedPlatformAgreement = this.modal.locator('fieldset', {
      hasText: 'Signed Platform Agreement?'
    })
    this.cancelBtn = this.modal.getByRole('button', { name: 'Cancel' })
    this.addCompanyBtn = this.modal.getByRole('button', { name: 'Add company' })
    this.errorMsgs = this.modal.locator('.chakra-form__error-message')
  }

  async addCompany(input) {
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
    if (input.coNumber) {
      await this.coNumber.fill(input.coNumber)
    }
    if (input.number) {
      await this.coNumber.fill(input.number)
    }
    if (input.legalName) {
      await this.legalName.fill(input.legalName)
    }
    if (input.stage) {
      await this.stage.selectOption(input.stage)
    }
    if (input.description) {
      await this.description.fill(input.description)
    }
    if (input.signedPlatformAgreement) {
      await this.signedPlatformAgreement
        .locator('.chakra-radio', { hasText: input.signedPlatformAgreement })
        .click()
    }
  }
  async getErrorMsg(fieldLabel) {
    return await this.modal
      .locator('[role="group"]', { hasText: fieldLabel })
      .locator('.chakra-form__error-message')
  }
  async goto() {
    await this.page.goto('/companies/add-company')
  }
  async submit() {
    await this.addCompanyBtn.click({ delay: 500 })
  }
  async isPlatformAgreementSigned() {
    return await this.modal
      .locator('[name="hasPlatformAgreement"][checked]+span+span')
      .textContent()
  }
}
