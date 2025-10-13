import { Locator, Page } from '@playwright/test'

export class AddCallNoteForm {
  private page: Page
  readonly modal: Locator
  readonly heading: Locator
  readonly xcloseBtn: Locator
  readonly callNotesURL: Locator
  readonly intervieweeName: Locator
  readonly type: Locator
  readonly sourceForInterview: Locator
  readonly intervieweeCompany: Locator
  readonly intervieweeEmail: Locator
  readonly intervieweeLinkedinUrl: Locator
  readonly stakeholders: Locator
  readonly companyIds: Locator
  readonly attachments: Locator
  readonly disclaimer: Locator
  readonly cancelBtn: Locator
  readonly addCallNoteBtn: Locator

  constructor(page: Page, modal: Locator) {
    this.page = page
    this.modal = modal
    this.heading = this.modal.locator('.chakra-modal__header')
    this.xcloseBtn = this.modal.getByRole('button', { name: 'Close' })
    this.callNotesURL = this.modal.getByRole('textbox', {
      name: 'Call notes URL',
      exact: true
    })
    this.intervieweeName = this.modal.getByRole('textbox', {
      name: 'Interviewee name',
      exact: true
    })
    this.companyIds = this.modal.locator('[data-testid="companyIds"]')
    this.type = this.modal.locator('[data-testid="type"]')
    this.sourceForInterview = this.modal.locator(
      '[data-testid="sourceOfInterview"]'
    )
    this.intervieweeCompany = this.modal.getByRole('textbox', {
      name: 'Interviewee company (optional)',
      exact: true
    })
    this.intervieweeEmail = this.modal.getByRole('textbox', {
      name: 'Interviewee email (optional)',
      exact: true
    })
    this.intervieweeLinkedinUrl = this.modal.getByRole('textbox', {
      name: 'Interviewee LinkedIn URL (optional)',
      exact: true
    })
    this.stakeholders = this.modal.locator('[data-testid="stakeholders"]')
    this.attachments = this.modal.getByTestId('attachments')
    this.disclaimer = this.modal.locator(
      '[data-testid="isAttachmentDisclaimerAccepted"]'
    )
    this.cancelBtn = this.modal.getByRole('button', {
      name: 'Cancel',
      exact: true
    })
    this.addCallNoteBtn = this.modal.getByRole('button', {
      name: 'Add call notes',
      exact: true
    })
  }
  async acceptDisclaimer() {
    await this.disclaimer.locator('.chakra-checkbox__control').click()
  }
  async attachFile(filepath) {
    let [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      await this.page.getByRole('button', { name: 'Click to upload' }).click()
    ])
    await fileChooser.setFiles([filepath])
  }
  async addNote(input) {
    await this.fillout(input)
    await this.submit()
  }
  async fillout(input) {
    if (input.noteHref) {
      await this.callNotesURL.fill(input.noteHref)
    }
    if (input.companyIds) {
      await this.companyIds.getByRole('combobox').click()
      await this.companyIds
        .getByRole('option', { name: `${input.companyIds}` })
        .click()
    }

    if (input.intervieweeName) {
      await this.intervieweeName.fill(input.intervieweeName)
    }
    if (input.type) {
      await this.type.getByRole('combobox').click()
      await this.type.getByRole('option', { name: input.type }).click()
    }
    if (input.sourceOfInterview) {
      await this.sourceForInterview
        .getByRole('combobox', {
          name: 'Interview source'
        })
        .click()
      await this.sourceForInterview
        .getByRole('option', { name: input.sourceOfInterview })
        .click()
    }
    if (input.intervieweeCompany) {
      await this.intervieweeCompany.fill(input.intervieweeCompany)
    }
    if (input.intervieweeEmail) {
      await this.intervieweeEmail.fill(input.intervieweeEmail)
    }
    if (input.linkedInProfileHref) {
      await this.intervieweeLinkedinUrl.fill(input.linkedInProfileHref)
    }
    if (input.stakeholders) {
      await this.stakeholders.getByRole('combobox').click()
      for (const s of input.stakeholders) {
        await this.stakeholders.getByRole('option', { name: s }).click()
      }
      // click away to close the pop-up
      await this.stakeholders.locator('label').click()
    }
    if (input.attachments) {
      let [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        await this.page.getByRole('button', { name: 'Click to upload' }).click()
      ])
      const paths = input.attachments.map(a => a.href)
      await fileChooser.setFiles(paths)
    }
    if (input.acceptDisclaimer) {
      this.acceptDisclaimer()
    }
  }
  async getErrorMsg(fieldLabel) {
    return await this.modal
      .locator('[role="group"]', { hasText: fieldLabel })
      .locator('.chakra-form__error-message')
  }
  async removeAttachment(filename) {
    await this.attachments.locator(`button[id="${filename}"]`).click()
  }
  async submit() {
    await this.addCallNoteBtn.click()
  }
}
