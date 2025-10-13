import { Locator, Page } from '@playwright/test'

class Section {
  readonly page: Page
  readonly elem: Locator
  readonly heading: Locator
  readonly text: Locator

  constructor(page: Page, section: Locator) {
    this.page = page
    this.elem = section
    this.heading = this.elem.getByRole('heading')
    this.text = this.elem.getByRole('paragraph').first()
  }
}
export const TASK_STATUS = {
  NOT_STARTED: 'Not Started',
  DRAFT: 'In progress',
  COMPLETED: 'Done'
}
class Task {
  readonly page: Page
  readonly elem: Locator
  readonly heading: Locator
  readonly text: Locator
  readonly icon: Locator

  constructor(page: Page, elem: Locator) {
    this.page = page
    this.elem = elem
    this.heading = elem.getByRole('paragraph').first()
    this.text = elem.getByRole('paragraph').nth(1)
    this.icon = elem.locator('svg')
  }
  async status() {
    const taskStatus = await this.elem.getAttribute('data-testid')
    if (taskStatus == null) {
      return TASK_STATUS.NOT_STARTED
    } else {
      return TASK_STATUS[taskStatus]
    }
  }
}

class InfraSetup extends Section {
  readonly page: Page
  readonly elem: Locator
  readonly privacyTask: Task
  readonly techStackTask: Task
  readonly startNowBtn: Locator
  readonly seeDetailsBtn: Locator

  constructor(page: Page, section: Locator) {
    super(page, section)
    this.page = page
    this.elem = section
    this.privacyTask = new Task(
      this.page,
      this.elem.getByRole('listitem').first()
    )
    this.techStackTask = new Task(
      this.page,
      this.elem.getByRole('listitem').nth(1)
    )
    this.startNowBtn = this.elem.getByRole('link', { name: 'Start now' })
    this.seeDetailsBtn = this.elem.getByRole('link', { name: 'See details' })
  }
}
class DocsSection extends Section {
  readonly page: Page
  readonly elem: Locator
  readonly viewDocsBtn: Locator

  constructor(page: Page, section: Locator) {
    super(page, section)
    this.page = page
    this.elem = section
    this.viewDocsBtn = this.elem.getByRole('button', { name: 'View docs' })
  }
}
export class Overview {
  private page: Page
  readonly tabPanel: Locator
  readonly infrastructureSetupSection: InfraSetup
  readonly documentationSection: DocsSection

  constructor(page: Page, tabPanel: Locator) {
    this.page = page
    this.tabPanel = tabPanel
    this.infrastructureSetupSection = new InfraSetup(
      this.page,
      this.tabPanel.locator('[data-id="get-started"]')
    )
    this.documentationSection = new DocsSection(
      this.page,
      this.tabPanel.locator('section').nth(1)
    )
  }
}
