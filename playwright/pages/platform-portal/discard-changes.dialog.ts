import { Locator, Page } from '@playwright/test'

export class DiscardChangesDialog {
  readonly page: Page
  readonly modal: Locator
  readonly heading: Locator
  readonly message: Locator
  readonly takeMeBackBtn: Locator
  readonly discardChangesBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.modal = this.page.locator('.chakra-modal__content', {
      hasText: 'Discard unsaved changes?'
    })
    this.heading = this.page.getByRole('heading')
    this.message = this.page.locator('.chakra-modal__body')
    this.takeMeBackBtn = this.page.getByRole('button', { name: 'Take me back' })
    this.discardChangesBtn = this.page.getByRole('button', {
      name: 'Discard changes'
    })
  }
}
