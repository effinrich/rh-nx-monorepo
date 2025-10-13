import { Locator, Page } from '@playwright/test'
import { SearchPanel } from '../../components/searchPanel'
import { AddCEOForm } from './form/add.form'

class CEOCard {
  private wrapper: Locator
  private cardHeader: Locator
  readonly name: Locator
  readonly optOutIcon: Locator
  readonly email: Locator
  readonly location: Locator
  readonly viewProfileBtn: Locator
  readonly profileLockIcon: Locator
  readonly profileRestrictedTxt: Locator
  readonly companyName: Locator
  readonly fundraiseStage: Locator
  readonly customerSegment: Locator
  readonly healthcareSector: Locator
  readonly businessFocusArea: Locator

  constructor(wrapper: Locator) {
    this.wrapper = wrapper
    this.cardHeader = this.wrapper.locator('.chakra-card__header')
    this.name = this.cardHeader.locator('h3')
    this.optOutIcon = this.cardHeader.locator('[aria-label="CEO opt-out icon"]')
    this.email = this.cardHeader.locator('.css-1vakbk4:nth-of-type(1) a')
    this.location = this.cardHeader.locator('.css-1vakbk4:nth-of-type(2)')
    this.viewProfileBtn = this.cardHeader.locator('.chakra-button')
    this.profileLockIcon = this.cardHeader.locator('.chakra-stack svg')
    this.profileRestrictedTxt = this.cardHeader.locator('.chakra-stack p')
    this.companyName = this.wrapper.locator('li:nth-of-type(1) a')
    this.fundraiseStage = this.wrapper.locator('li:nth-of-type(2) div')
    this.customerSegment = this.wrapper.locator('li:nth-of-type(3) div div')
    this.healthcareSector = this.wrapper.locator('li:nth-of-type(4) div')
    this.businessFocusArea = this.wrapper.locator('li:nth-of-type(5) div div')
  }

  async isProfileRestricted() {
    return (
      (await this.viewProfileBtn.count()) == 0 &&
      (await this.profileRestrictedTxt.count()) == 1 &&
      (await this.profileLockIcon.count()) == 1 &&
      (await this.profileLockIcon.isVisible()) &&
      (await this.profileRestrictedTxt.textContent()) == 'Profile restricted'
    )
  }

  async isCompanyNameBlurred() {
    const companyCount = await this.companyName.count()
    const blurredCompanyCount = await this.wrapper
      .locator('[data-testid="company-name"] .css-1n48gh1')
      .count()
    if (companyCount == 0 && blurredCompanyCount >= 1) {
      return true
    } else {
      return false
    }
  }
  async isEmailBlurred() {
    return (
      (await this.email.count()) == 0 &&
      (await this.cardHeader
        .locator('.css-1vakbk4:nth-of-type(1) svg + .css-1n48gh1')
        .count()) == 1
    )
  }
  async isLastNameBlurred() {
    return (await this.name.locator('p .css-1n48gh1').count()) == 1
  }
  async isLocationBlurred() {
    const locationCount = await this.location.count()
    const blurredLocationCount = await this.location
      .locator('.css-1n48gh1')
      .count()
    if (blurredLocationCount == locationCount) {
      return true
    } else {
      await console.log('locationCount:', locationCount)
      await console.log('blurredLocationCount:', blurredLocationCount)
      return false
    }
  }
}
export class Directory extends SearchPanel {
  readonly page: Page
  readonly panel: Locator
  readonly pageHeading: Locator
  readonly pageSubheading: Locator
  readonly viewMyProfileBtn: Locator
  readonly pageDescription: Locator
  readonly searchbox: Locator
  readonly fundraiseFilter: Locator
  readonly healthcareFilter: Locator
  readonly businessFocusFilter: Locator
  readonly customerSegmentFilter: Locator
  readonly businessTypeFilter: Locator
  private allCards: Locator
  readonly firstCard: Locator
  readonly allCEONames: Locator
  readonly allCEOEmails: Locator
  readonly allCompanyNames: Locator
  readonly allFundraiseStages: Locator
  readonly allCustomerSegments: Locator
  readonly allHealthcareSectors: Locator
  readonly allBusinessFocusAreas: Locator
  readonly loadingSpinner: Locator
  readonly addCEOBtn: Locator
  readonly addCEOForm: AddCEOForm
  readonly noCEOsFound: Locator

  constructor(page: Page) {
    super(page.locator('main section'))
    this.page = page
    this.panel = this.wrapper
    this.pageHeading = this.panel.locator('h1')
    this.pageSubheading = this.panel.locator('h2')
    this.viewMyProfileBtn = this.panel.getByRole('link', {
      name: 'View my profile',
      exact: true
    })
    this.pageDescription = this.panel.locator('h2 + p')
    this.searchbox = this.panel.getByRole('textbox', { name: 'Search' })
    this.fundraiseFilter = this.panel.locator(
      '[data-testid="fundraiseStatusFilter"]'
    )
    this.healthcareFilter = this.panel.locator(
      '[data-testid="healthcareSectorFilter"]'
    )
    this.businessFocusFilter = this.panel.locator(
      '[data-testid="businessFocusAreaFilter"]'
    )
    this.customerSegmentFilter = this.panel.locator(
      '[data-testid="customerSegmentFilter"]'
    )
    this.businessTypeFilter = this.panel.locator(
      '[data-testid="businessTypeFilter"]'
    )
    this.allCards = this.panel.locator('.chakra-card')
    this.firstCard = this.allCards.first()
    this.allCEONames = this.panel.locator('.chakra-card__header h3')
    this.allCEOEmails = this.panel.locator('.chakra-card__header svg + a')
    this.allCompanyNames = this.panel.getByRole('listitem', {
      name: 'Company name'
    })
    this.allFundraiseStages = this.panel.getByRole('listitem', {
      name: 'Fundraising stage'
    })
    this.allCustomerSegments = this.panel.getByRole('listitem', {
      name: 'Customer segment'
    })
    this.allHealthcareSectors = this.panel.getByRole('listitem', {
      name: 'Healthcare sector'
    })
    this.allBusinessFocusAreas = this.panel.getByRole('listitem', {
      name: 'Business focus area'
    })
    this.loadingSpinner = this.panel.getByText('Loading...')
    this.addCEOBtn = this.panel.getByRole('link', {
      name: 'Add CEO',
      exact: true
    })
    this.addCEOForm = new AddCEOForm(this.page)
    this.noCEOsFound = this.panel.locator('.chakra-stack')
  }

  async allCEOCards() {
    const cardElements = await this.panel.locator('.chakra-card').all()
    return cardElements.map(x => new CEOCard(x))
  }

  async filterCEOs(field: string, term: string) {
    const filters = {
      'Fundraise stage': this.fundraiseFilter,
      'Healthcare sector': this.healthcareFilter,
      'Business focus area': this.businessFocusFilter,
      'Customer segment': this.customerSegmentFilter,
      'Business type': this.businessTypeFilter
    }
    await filters[field].locator('div:nth-of-type(1)').first().click()
    await filters[field].getByRole('combobox').fill(term)
    await filters[field]
      .getByRole('option', { name: term, exact: true })
      .click()
  }
  async goto() {
    await this.page.goto('/ceo-directory')
  }
  async gotoProfile(id) {
    await this.page.goto(`/ceo-directory/${id}`)
  }
}
