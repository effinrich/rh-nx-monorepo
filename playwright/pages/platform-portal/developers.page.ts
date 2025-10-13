import { Page } from '@playwright/test'
import { Searchbox } from './components/components'
import { MainPanel, SidenavPanel } from './dashboard/dashboard.page'

export class DevelopersPage {
  readonly page: Page
  readonly sidenav: SidenavPanel
  readonly mainpanel: MainPanel
  readonly searchbox: Searchbox

  constructor(page: Page) {
    this.page = page
    this.sidenav = new SidenavPanel(page)
    this.mainpanel = new MainPanel(page)
    this.searchbox = new Searchbox(
      page,
      this.page.locator('.chakra-stack .chakra-form-control')
    )
  }

  async goto() {
    await this.page.goto('/dev-library')
  }

  async search(term) {
    await this.searchbox.inputTB.fill(term)
  }
}
