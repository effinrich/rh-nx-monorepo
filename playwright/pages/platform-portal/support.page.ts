import { Locator, Page } from '@playwright/test'
import { MainPanel, SidenavPanel } from './dashboard/dashboard.page'

export class SupportPage {
  readonly page: Page
  readonly sidenav: SidenavPanel
  readonly mainpanel: MainPanel
  readonly slackSection: Locator
  readonly emailSection: Locator

  constructor(page: Page) {
    this.page = page
    this.sidenav = new SidenavPanel(page)
    this.mainpanel = new MainPanel(page)
    this.slackSection = this.mainpanel.panel.locator('slack')
    this.emailSection = this.mainpanel.panel.locator('section', {
      hasText: /Email us/i
    })
  }
}
