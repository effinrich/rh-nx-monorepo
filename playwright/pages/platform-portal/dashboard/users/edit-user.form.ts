import { Locator, Page } from '@playwright/test'
import {
  ChakraAlert,
  ChakraRadioButton,
  MultiSelect
} from '../../components/components'
import { DiscardChangesDialog } from '../../discard-changes.dialog'
import { SuccessPage } from '../../success.page'

export class EditUserForm {
  readonly page: Page
  readonly modal: Locator
  readonly heading: Locator
  readonly subheading: Locator
  readonly xcloseBtn: Locator
  readonly roleLabel: Locator
  readonly superAdminRB: ChakraRadioButton
  readonly adminRB: ChakraRadioButton
  readonly rhUserRB: ChakraRadioButton
  readonly coUserRB: ChakraRadioButton
  readonly emailTB: Locator
  readonly givenNameTB: Locator
  readonly familyNameTB: Locator
  readonly companyAssignmentSel: MultiSelect
  readonly companyAssignmentHintText: Locator
  readonly cancelBtn: Locator
  readonly addUserBtn: Locator
  readonly submitRequestBtn: Locator
  readonly success: SuccessPage
  readonly errorMsg: Locator
  readonly chakraAlert: ChakraAlert
  readonly discardChangesDialog: DiscardChangesDialog

  constructor(page: Page) {
    this.page = page
    this.modal = this.page.locator('.chakra-modal__content')
    this.heading = this.modal.locator('header')
    this.subheading = this.modal.locator('p:nth-of-type(2)')
    this.xcloseBtn = this.modal.getByRole('button', { name: 'close form' })
    this.roleLabel = this.modal.locator('label', { hasText: 'User type' })
    this.superAdminRB = new ChakraRadioButton(
      this.modal.locator('.chakra-radio', { hasText: 'Super Admin' })
    )
    this.adminRB = new ChakraRadioButton(
      this.modal.locator('.chakra-radio', { hasText: /^Admin/ })
    )
    this.rhUserRB = new ChakraRadioButton(
      this.modal.locator('.chakra-radio', { hasText: 'RH User' })
    )
    this.coUserRB = new ChakraRadioButton(
      this.modal.locator('.chakra-radio', { hasText: 'Company User' })
    )
    this.emailTB = this.modal.locator('input[name="email"]')
    this.givenNameTB = this.modal.locator('input[name="givenName"]')
    this.familyNameTB = this.modal.locator('input[name="familyName"]')
    this.companyAssignmentSel = new MultiSelect(
      this.modal.locator('.chakra-form-control', {
        hasText: 'Company assignment'
      })
    )
    this.companyAssignmentHintText = this.modal
      .locator('.chakra-form-control', {
        hasText: 'Company assignment'
      })
      .locator('.chakra-form__helper-text')
    this.addUserBtn = this.modal.getByRole('button', {
      name: 'Edit user',
      exact: true
    })
    this.submitRequestBtn = this.modal.getByRole('button', {
      name: 'Submit Request'
    })
    this.cancelBtn = this.modal.getByRole('button', { name: 'Cancel' })
    this.success = new SuccessPage(this.page)
    this.errorMsg = this.modal.locator('.chakra-form__error-message')
    this.chakraAlert = new ChakraAlert(this.page)
    this.discardChangesDialog = new DiscardChangesDialog(this.page)
  }
  async editUser(input) {
    await this.fillout(input)
    await this.submit()
  }
  async fillout(input) {
    if (input.role) {
      if (input.role.match(/Super Admin/i)) {
        await this.superAdminRB.click()
      } else if (input.role.match(/Admin/i)) {
        await this.adminRB.click()
      } else if (input.role.match(/RH User/i)) {
        await this.rhUserRB.click()
      } else if (input.role.match(/Company User/i)) {
        await this.coUserRB.click()
      } else {
        throw new Error(`Unknown User Type:  ${input.role}`)
      }
    }
    if (input.email) {
      await this.emailTB.fill(input.email)
    }
    if (input.givenName) {
      await this.givenNameTB.fill(input.givenName)
    }
    if (input.familyName) {
      await this.familyNameTB.fill(input.familyName)
    }
    if (input.company) {
      await this.companyAssignmentSel.input.fill(input.company)
    }
  }
  async getErrorMsg(fieldLabel) {
    return await this.modal
      .locator('[role="group"]', { hasText: fieldLabel })
      .locator('.chakra-form__error-message')
  }
  async submit() {
    if (await this.addUserBtn.isEnabled()) {
      await this.addUserBtn.click({ delay: 500 })
    }
  }
}
