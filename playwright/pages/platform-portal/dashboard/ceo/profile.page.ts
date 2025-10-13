import { Locator, Page } from '@playwright/test'
import { AddCEOForm } from './form/add.form'
import { EditCEOForm } from './form/edit.form'

export class Profile {
  readonly page: Page
  private mainPanel: Locator
  readonly backBtn: Locator
  readonly avatar: Locator
  readonly name: Locator
  readonly emailLink: Locator
  readonly location: Locator
  readonly editBtn: Locator
  readonly company: Locator
  readonly coDescription: Locator
  readonly fundraisingStage: Locator
  readonly businessType: Locator
  readonly customerSegment: Locator
  readonly healthcareSector: Locator
  readonly businessFocusArea: Locator
  readonly marketServiceArea: Locator
  readonly linkedInProfileUrl: Locator
  readonly ceoBio: Locator
  readonly addForm: AddCEOForm
  readonly editForm: EditCEOForm

  constructor(page: Page) {
    this.page = page
    this.mainPanel = this.page.locator('main')
    this.backBtn = this.mainPanel.locator('svg + p')
    this.avatar = this.mainPanel.locator('TBD')
    this.name = this.mainPanel.locator('h2')
    this.emailLink = this.mainPanel.locator('[data-testid="email"]')
    this.location = this.mainPanel.locator('[data-testid="location"]')
    this.editBtn = this.mainPanel.getByRole('link', { name: 'Edit profile' })
    this.company = this.mainPanel.locator('[data-testid="company"] a')
    this.coDescription = this.mainPanel.locator('[data-testid="company"] svg')
    this.fundraisingStage = this.mainPanel.locator(
      '[data-testid="fundraising-stage"] p + div'
    )
    this.businessType = this.mainPanel.locator(
      '[data-testid="business-type"] p + div'
    )
    this.customerSegment = this.mainPanel.locator(
      '[data-testid="customer-segment"] div span'
    )
    this.healthcareSector = this.mainPanel.locator(
      '[data-testid="healthcare-sector"] p + div'
    )
    this.businessFocusArea = this.mainPanel.locator(
      '[data-testid="business-focus-area"] div span'
    )
    this.marketServiceArea = this.mainPanel.locator(
      '[data-testid="market/service-area"] div span'
    )
    this.linkedInProfileUrl = this.mainPanel.locator(
      '[data-testid="linkedin-profile-url"] a'
    )
    this.ceoBio = this.mainPanel.locator('[data-testid="ceo-bio"] p + div')
    this.addForm = new AddCEOForm(this.page)
    this.editForm = new EditCEOForm(this.page)
  }
  async goto(ceoId) {
    await this.page.goto(`/ceo-directory/${ceoId}`)
  }
  async read() {
    let ceo = {}
    ceo['email'] = await this.emailLink.textContent()
    if ((await this.name.count()) > 0) {
      ceo['name'] = await this.name.textContent()
    } else {
      console.log('name element not found!')
    }
    if ((await this.location.count()) > 0) {
      ceo['location'] = await this.location.textContent()
    }
    if ((await this.company.count()) > 0) {
      ceo['company'] = await this.company.textContent()
      ceo['coHref'] = await this.company.getAttribute('href')
      await this.coDescription.hover()
      ceo['coDesc'] = await this.page.getByRole('tooltip').textContent()
    } else {
      console.log('company not found!')
    }
    if ((await this.fundraisingStage.count()) > 0) {
      ceo['fundraisingStage'] = await this.fundraisingStage.textContent()
    }
    if ((await this.linkedInProfileUrl.count()) > 0) {
      ceo['linkedInProfileUrl'] = await this.linkedInProfileUrl.textContent()
    }
    if (await this.businessType.textContent()) {
      ceo['businessType'] = await this.businessType.textContent()
    }
    if ((await this.customerSegment.count()) > 0) {
      ceo['customerSegment'] = await this.customerSegment.evaluateAll(list =>
        list.map(e => e.textContent)
      )
    }
    if ((await this.healthcareSector.count()) > 0) {
      const sector = await this.healthcareSector.textContent()
      if (sector) {
        ceo['healthcareSector'] = sector
      }
    }
    if ((await this.businessFocusArea.count()) > 0) {
      ceo['businessFocusArea'] = await this.businessFocusArea.evaluateAll(
        list => list.map(e => e.textContent)
      )
    }
    if ((await this.marketServiceArea.count()) > 0) {
      ceo['marketServiceArea'] = await this.marketServiceArea.evaluateAll(
        list => list.map(e => e.textContent)
      )
    }
    if (await this.ceoBio.textContent()) {
      ceo['bio'] = await this.ceoBio.textContent()
    }
    return ceo
  }
}
