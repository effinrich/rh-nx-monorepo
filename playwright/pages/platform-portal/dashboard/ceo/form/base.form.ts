import { Locator, Page } from '@playwright/test'
import {
  ChakraFormControl,
  ChakraRadioButtonGroup,
  CheckboxGroup,
  MultiSelect,
  SingleSelect,
  Textarea,
  Textbox
} from '../../../components/components'
import {
  businessFocusAreas,
  customerSegments,
  healthcareSectors
} from '../../../../../data/platform/ceos'

export class CEOForm {
  protected page: Page
  protected mainPanel: Locator
  readonly form: Locator
  readonly heading: Locator
  readonly selectUser: ChakraFormControl
  readonly uploadHeadshot: Locator
  readonly nearestMetroArea: ChakraFormControl
  readonly bio: ChakraFormControl
  readonly additionalInfo: ChakraFormControl
  readonly linkedInProfileURL: ChakraFormControl
  readonly visible: ChakraFormControl
  readonly businessType: ChakraFormControl
  readonly customerSegment: ChakraFormControl
  readonly healthcareSector: ChakraFormControl
  readonly businessFocusArea: ChakraFormControl
  readonly marketServiceArea: ChakraFormControl
  readonly cancelBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.mainPanel = this.page.locator('main')
    this.form = this.mainPanel.locator('form')
    this.heading = this.mainPanel.locator('h1')
    this.selectUser = new ChakraFormControl({
      locator: this.form.locator('[data-testid="email"]'),
      label: 'Select a user',
      control: new SingleSelect(this.form.locator('[data-testid="email"]'))
    })
    this.uploadHeadshot = this.form.locator('[data-testid="pictureHref"]')
    this.nearestMetroArea = new ChakraFormControl({
      locator: this.form.locator('[data-testid="location"]'),
      label: 'Nearest metropolitan area',
      control: new SingleSelect(this.form.locator('[data-testid="location"]'))
    })
    this.bio = new ChakraFormControl({
      locator: this.form.locator('[data-testid="bio"]'),
      label: 'Bio',
      control: new Textarea(this.form.locator('[data-testid="bio"]'))
    })
    this.additionalInfo = new ChakraFormControl({
      locator: this.form.locator('[data-testid="additionalInfo"]'),
      label: 'What do you want other Redesigners to know about you?',
      control: new Textarea(this.form.locator('[data-testid="additionalInfo"]'))
    })
    this.linkedInProfileURL = new ChakraFormControl({
      locator: this.form.locator('[data-testid="linkedinHref"]'),
      label: 'LinkedIn profile URL',
      control: new Textbox(this.form.locator('[data-testid="linkedinHref"]'))
    })
    this.visible = new ChakraFormControl({
      locator: this.form.locator('[data-testid="visible"]'),
      label: '',
      control: new ChakraRadioButtonGroup(
        this.form.locator('[data-testid="visible"]')
      )
    })
    this.businessType = new ChakraFormControl({
      locator: this.form.locator('[data-testid="businessType"]'),
      label: 'Business type',
      control: new ChakraRadioButtonGroup(
        this.form.locator('[data-testid="businessType"]')
      )
    })
    this.customerSegment = new ChakraFormControl({
      locator: this.form.locator('[data-testid="customerSegment"]'),
      label: 'Customer segment (select all that apply',
      control: new CheckboxGroup(
        this.form.locator('[data-testid="customerSegment"]')
      )
    })
    this.healthcareSector = new ChakraFormControl({
      locator: this.form.locator('[data-testid="healthcareSector"]'),
      label: 'Healthcare sector',
      control: new SingleSelect(
        this.form.locator('[data-testid="healthcareSector"]')
      )
    })
    this.businessFocusArea = new ChakraFormControl({
      locator: this.form.locator('[data-testid="businessFocusArea"]'),
      label: 'Business focus area',
      control: new MultiSelect(
        this.form.locator('[data-testid="businessFocusArea"]')
      )
    })
    this.marketServiceArea = new ChakraFormControl({
      locator: this.form.locator('[data-testid="marketServiceArea"]'),
      label: 'Market service area',
      control: new MultiSelect(
        this.form.locator('[data-testid="marketServiceArea"]')
      )
    })
    this.cancelBtn = this.mainPanel
      .locator('footer')
      .getByRole('button', { name: 'Cancel', exact: true })
  }

  async fillout(input: CEOCommand) {
    if (input.email) {
      await this.selectUser.control.select(input.email)
    }
    if (input.pictureHref) {
      await this.uploadHeadshot
        .locator('input[type="file"]')
        .setInputFiles(input.pictureHref)
      await this.page.getByRole('button', { name: 'Save picture' }).click()
    }
    if (input.location) {
      await this.nearestMetroArea.control.select(input.location, true)
    }
    if (input.bio) {
      await this.bio.control.fill(input.bio)
    }
    if (input.additionalInfo) {
      await this.additionalInfo.control.fill(input.additionalInfo)
    }
    if (input.linkedinHref) {
      await this.linkedInProfileURL.control.fill(input.linkedinHref)
    }
    if (input.visible) {
      if (input.visible == 'OPT_IN') {
        await this.visible.control.select(/^Yes/)
      } else {
        await this.visible.control.select(/^No/)
      }
    }
    if (input.businessType) {
      await this.businessType.control.select(input.businessType)
    }
    if (input.customerSegment) {
      const values = input.customerSegment.map(x => customerSegments[x])
      await this.customerSegment.control.check(values)
    }
    if (input.healthcareSector) {
      await this.healthcareSector.control.select(
        healthcareSectors[input.healthcareSector],
        true
      )
    }
    if (input.businessFocusArea) {
      const values = input.businessFocusArea.map(x => businessFocusAreas[x])
      await this.businessFocusArea.control.select(values)
    }
    if (input.marketServiceArea) {
      await this.marketServiceArea.control.select(input.marketServiceArea)
    }
  }
}
