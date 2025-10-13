import { Locator, Page } from '@playwright/test'

class Alert {
  readonly page: Page
  readonly elem: Locator
  readonly message: Locator
  readonly statusBadge: Locator

  constructor(page: Page, elem: Locator) {
    this.page = page
    this.elem = elem
    this.message = this.elem.getByRole('paragraph')
    this.statusBadge = this.elem.locator('.chakra-badge')
  }
}
class Task {
  readonly rowLocator: Locator
  readonly heading: Locator
  readonly subheading: Locator
  readonly statusIcon: Locator
  readonly statusText: Locator
  readonly startBtn: Locator
  readonly continueEditingBtn: Locator
  readonly reviewSelectionsBtn: Locator

  constructor(rowLocator: Locator) {
    this.rowLocator = rowLocator
    this.heading = rowLocator.locator('h3')
    this.subheading = rowLocator.locator('h3+p')
    this.statusIcon = rowLocator.locator('svg')
    this.statusText = rowLocator.locator('svg+p')
    this.startBtn = rowLocator.getByRole('link', { name: 'Start' })
    this.continueEditingBtn = rowLocator.getByRole('link', {
      name: 'Continue editing'
    })
    this.reviewSelectionsBtn = rowLocator.getByRole('link', {
      name: 'Review selections'
    })
  }
  async clickStartBtn() {
    await this.startBtn.click()
  }
}
export class Infrastructure {
  private page: Page
  readonly tabPanel: Locator
  readonly infraHeading: Locator
  readonly infraSubheading: Locator
  readonly statusAlert: Alert
  readonly privacyQuestionnaire: Task
  readonly techStackQuestionnaire: Task
  readonly submitBtn: Locator

  constructor(page: Page, tabPanel: Locator) {
    this.page = page
    this.tabPanel = tabPanel
    this.infraHeading = this.tabPanel.locator('h2')
    this.infraSubheading = this.tabPanel.getByText(/^This form should be/)
    this.statusAlert = new Alert(this.page, this.tabPanel.getByRole('alert'))
    this.privacyQuestionnaire = new Task(
      this.tabPanel.locator('[data-id="start-privacy"]')
    )
    this.techStackQuestionnaire = new Task(
      this.tabPanel.locator('[data-id="start-tech-stack"]')
    )
    this.submitBtn = this.tabPanel.getByRole('button', { name: 'Submit' })
  }
}
