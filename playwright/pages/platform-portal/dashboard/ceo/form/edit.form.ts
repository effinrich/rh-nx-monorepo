import { Locator, Page } from '@playwright/test'
import { CEOForm } from './base.form'

export class EditCEOForm extends CEOForm {
  readonly updateBtn: Locator
  readonly ceoName: Locator
  readonly ceoCompany: Locator
  readonly ceoEmail: Locator

  constructor(page: Page) {
    super(page)
    this.updateBtn = this.mainPanel
      .locator('footer')
      .getByRole('button', { name: 'Update', exact: true })
    this.ceoName = this.mainPanel.locator('form b[class~="chakra-text"]')
    this.ceoCompany = this.mainPanel.locator('[data-testid="companyName"]')
    this.ceoEmail = this.mainPanel.locator('[data-testid="email"]')
  }

  async editCEO(input) {
    await this.fillout(input)
    await this.submit()
  }

  async goto(ceoId) {
    await this.page.goto(`/ceo-directory/${ceoId}/edit`)
  }

  async read() {
    let ceo = {}
    ceo['name'] = await this.ceoName.textContent()
    ceo['companyName'] = await this.ceoCompany.textContent()
    ceo['email'] = await this.ceoEmail.textContent()
    ceo['location'] = await this.nearestMetroArea.control.selected()
    ceo['bio'] = await this.bio.control.textContent()
    ceo['additionalInfo'] = await this.additionalInfo.control.textContent()
    ceo['linkedinHref'] = await this.linkedInProfileURL.control.textContent()
    ceo['visible'] = await this.visible.control.selected()
    ceo['businessType'] = await this.businessType.control.selected()
    ceo['customerSegment'] = await this.customerSegment.control.allChecked()
    ceo['healthcareSector'] = await this.healthcareSector.control.selected()
    ceo['businessFocusArea'] =
      await this.businessFocusArea.control.allSelected()
    ceo['marketServiceArea'] =
      await this.marketServiceArea.control.allSelected()
    return ceo
  }

  async submit() {
    await this.updateBtn.click()
  }
}
