import { Locator, Page } from '@playwright/test'
import { AddUserForm } from './users/add-user.form'

export class SidenavPanel {
  readonly page: Page
  readonly panel: Locator
  readonly logoIcon: Locator
  readonly homeBtn: Locator
  readonly companiesBtn: Locator
  readonly myCoBtn: Locator
  readonly usersBtn: Locator
  readonly libraryBtn: Locator
  readonly researchHubBtn: Locator
  readonly ceoDirectoryBtn: Locator
  readonly vendorsBtn: Locator
  readonly developersBtn: Locator
  readonly supportAndFeedbackBtn: Locator
  readonly username: Locator
  readonly logoutBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.panel = page.locator('[data-testid="sidenav"]')
    this.logoIcon = page.getByRole('img', { name: 'Redesign Health logo' })
    this.homeBtn = this.panel.getByRole('button', { name: 'Home' })
    this.companiesBtn = this.panel.getByRole('button', {
      name: 'Companies'
    })
    this.myCoBtn = this.panel.getByRole('button', { name: 'My company' })
    this.usersBtn = this.panel.getByRole('button', {
      name: 'Users'
    })
    this.libraryBtn = this.panel.getByRole('link', { name: 'Library' })
    this.researchHubBtn = this.panel.getByRole('link', { name: 'Research Hub' })
    this.ceoDirectoryBtn = this.panel.getByRole('link', {
      name: 'CEO Directory'
    })
    this.vendorsBtn = this.panel.getByRole('link', { name: 'Vendors' })
    this.developersBtn = this.panel.getByRole('link', {
      name: 'Developer Tools'
    })
    this.supportAndFeedbackBtn = this.panel.getByRole('link', {
      name: 'Support & Feedback',
      exact: true
    })
    this.username = this.panel
      .locator('.chakra-avatar + div .chakra-text')
      .first()
    this.logoutBtn = this.panel.getByRole('button', { name: 'log out' })
  }
}

export class MainPanel {
  readonly page: Page
  readonly panel: Locator
  readonly heading: Locator
  readonly subheading: Locator
  readonly sectionHeading: Locator
  readonly cosCount: Locator
  readonly viewCompaniesBtn: Locator
  readonly viewMyCompaniesBtn: Locator
  readonly usersCount: Locator
  readonly viewAllUsersBtn: Locator
  readonly servicesHeading: Locator
  readonly addCoBtn: Locator
  readonly assignUsersHeading: Locator
  readonly addUserBtn: Locator
  readonly table: Locator

  constructor(page: Page) {
    this.page = page
    this.panel = page.locator('main')
    this.heading = this.panel.locator('h1')
    this.sectionHeading = this.panel.locator('h1')
    this.cosCount = this.panel.locator(
      '[data-id="companies-stats"] .chakra-stat__number'
    )
    this.viewCompaniesBtn = this.panel.locator(
      '[data-id="companies-stats"] [data-id="view-all"]'
    )
    this.viewMyCompaniesBtn = this.panel.locator(
      '[data-testid="companies-cta"] [data-id="add-entity"]'
    )
    this.usersCount = this.panel
      .locator('.chakra-stat', { hasText: 'Total Users' })
      .locator('dd')
    this.viewAllUsersBtn = this.panel.locator(
      '[data-id="users-stats"] [data-id="view-all"]'
    )
    this.servicesHeading = this.panel.locator('[data-testid="companies-cta"] p')
    this.addCoBtn = this.panel.getByText('Add company')
    this.assignUsersHeading = this.panel.locator('[data-testid="users-cta"] p')
    this.addUserBtn = this.panel.locator(
      '[data-testid="users-cta"] [data-id="add-entity"]'
    )
    this.table = this.panel.getByRole('table')
  }
}

export class Dashboard {
  readonly page: Page
  readonly authority: string
  readonly sidenav: SidenavPanel
  readonly mainpanel: MainPanel
  readonly addUserForm: AddUserForm

  constructor(page: Page) {
    this.page = page
    this.sidenav = new SidenavPanel(page)
    this.mainpanel = new MainPanel(page)
    this.addUserForm = new AddUserForm(this.page)
  }
  async goto() {
    await this.page.goto('/')
  }
  async gotoAddUserForm() {
    await this.page.goto('/?modal=add-user')
  }
  async logout() {
    await this.sidenav.logoutBtn.click()
  }
}
