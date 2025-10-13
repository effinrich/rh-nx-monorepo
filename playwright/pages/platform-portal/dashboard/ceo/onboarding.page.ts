import { Locator, Page } from '@playwright/test'
import {
  ChakraFormControl,
  ChakraRadioButtonGroup,
  MultiSelect
} from '../../components/components'
import {
  businessFocusAreas,
  customerSegments,
  healthcareSectors
} from '../../../../data/platform/ceos'

class OptInForm {
  private page: Page
  private form: Locator
  readonly ceoName: Locator
  readonly ceoCompany: Locator
  readonly ceoEmail: Locator
  readonly locationSel: Locator
  readonly bioTA: Locator
  readonly infoTA: Locator
  readonly linkedInProfileURLTB: Locator
  readonly visible: ChakraFormControl
  readonly busTypeRB: Locator
  readonly customerSegmentGrp: Locator
  readonly healthcareSectorSel: Locator
  readonly busFocusAreaSel: MultiSelect
  readonly marketSvcAreaSel: MultiSelect
  readonly backBtn: Locator
  readonly continueBtn: Locator

  constructor(page: Page, form: Locator) {
    this.page = page
    this.form = form
    this.ceoName = this.form.locator('.chakra-card b')
    this.ceoCompany = this.form.locator('[data-testid="companyName"]')
    this.ceoEmail = this.form.locator('[data-testid="email"]')
    this.locationSel = this.form.locator('[data-testid="location"] input[role]')
    this.bioTA = this.form.locator('[name="bio"]')
    this.infoTA = this.form.locator('[name="additionalInfo"]')
    this.linkedInProfileURLTB = this.form.locator('[name="linkedinHref"]')
    this.visible = new ChakraFormControl({
      locator: this.form.locator('[data-testid="visible"]'),
      label: '',
      control: new ChakraRadioButtonGroup(
        this.form.locator('[data-testid="visible"]')
      )
    })
    this.busTypeRB = this.form.locator('[data-testid="businessType"]')
    this.customerSegmentGrp = this.form.locator(
      '[data-testid="customerSegment"]'
    )
    this.healthcareSectorSel = this.form.locator(
      '[data-testid="healthcareSector"]'
    )
    this.busFocusAreaSel = new MultiSelect(
      this.form.locator('[data-testid="businessFocusArea"]')
    )
    this.marketSvcAreaSel = new MultiSelect(
      this.form.locator('[data-testid="marketServiceArea"]')
    )
    this.backBtn = this.page.getByRole('button', { name: 'Back' })
    this.continueBtn = this.page.getByRole('button', { name: 'Continue' })
  }

  async fillout(input: CEOCommand) {
    if (input.location) {
      await this.locationSel.click()
      await this.form.getByRole('option', { name: input.location }).click()
    }
    if (input.bio) {
      await this.bioTA.fill(input.bio)
    }
    if (input.additionalInfo) {
      await this.infoTA.fill(input.additionalInfo)
    }
    if (input.linkedinHref) {
      await this.linkedInProfileURLTB.fill(input.linkedinHref)
    }
    if (input.visible) {
      if (input.visible == 'OPT_IN') {
        await this.visible.control.choose(/^Yes/)
      } else {
        await this.visible.control.choose(/^No/)
      }
    }
    if (input.businessType) {
      await this.busTypeRB
        .locator('label', { hasText: input.businessType })
        .first()
        .click()
    }
    if (input.customerSegment) {
      const cbGrp = this.customerSegmentGrp
      for (const val of input.customerSegment) {
        await cbGrp
          .locator('label', { hasText: customerSegments[val] })
          .first()
          .click()
      }
    }
    if (input.healthcareSector) {
      await this.healthcareSectorSel.click()
      await this.healthcareSectorSel
        .getByRole('option', {
          name: healthcareSectors[input.healthcareSector],
          exact: true
        })
        .click()
    }
    if (input.businessFocusArea) {
      for (const val of input.businessFocusArea) {
        await this.busFocusAreaSel.input.fill(businessFocusAreas[val])
        await this.busFocusAreaSel.wrapper
          .getByRole('option', { name: businessFocusAreas[val], exact: true })
          .click()
      }
    }
    if (input.marketServiceArea) {
      for (const val of input.marketServiceArea) {
        await this.marketSvcAreaSel.input.fill(val)
        await this.marketSvcAreaSel.wrapper
          .getByRole('option', { name: val, exact: true })
          .click()
      }
    }
  }

  async readHeader() {
    return {
      ceoName: await this.ceoName.textContent(),
      ceoCompany: await this.ceoCompany.textContent(),
      ceoEmail: await this.ceoEmail.textContent()
    }
  }
  async submit() {
    await this.continueBtn.click()
  }
}

export class Onboarding {
  readonly page: Page
  readonly welcomeScreen: Locator
  readonly heading: Locator
  readonly subheading: Locator
  readonly question: Locator
  readonly optIn: Locator
  readonly optOut: Locator
  readonly backBtn: Locator
  readonly continueBtn: Locator
  readonly optOutAlert: Locator
  readonly continueToDirectoryBtn: Locator
  readonly optInForm: OptInForm
  readonly optInConfirmation: Locator
  readonly takeMeToDirectoryBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.welcomeScreen = this.page.locator('body main')
    this.heading = this.page.locator('h1')
    this.subheading = this.page.locator('h2')
    this.question = this.page.locator('p')
    this.optIn = this.page.locator('[value="OPT_IN"]+span')
    this.optOut = this.page.locator('[value="OPT_OUT"]+span')
    this.backBtn = this.page.getByRole('button', { name: 'Back', exact: true })
    this.continueBtn = this.page.getByRole('button', {
      name: 'Continue',
      exact: true
    })
    this.optOutAlert = this.page.locator('main .chakra-alert')
    this.continueToDirectoryBtn = this.page.getByRole('button', {
      name: 'Continue to directory',
      exact: true
    })
    this.optInForm = new OptInForm(this.page, this.page.locator('form'))
    this.optInConfirmation = this.page.locator(
      '#scrollContainer .chakra-stack',
      { hasText: /^Thanks/ }
    )
    this.takeMeToDirectoryBtn = this.optInConfirmation.getByRole('button', {
      name: /directory$/
    })
  }

  async goto() {
    await this.page.goto('/ceo-directory/onboarding')
  }
}
