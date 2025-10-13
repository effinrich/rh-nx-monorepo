import { Locator, Page } from '@playwright/test'
import { EditCompanyForm } from '../companies/company-details/edit.form'
import { EntityTable } from '../../components/entityTable'
import { MainPanel, SidenavPanel } from '../dashboard.page'
import { CompanyPage } from './company-details/company.page'
import { AddCompanyForm } from './add-company.form'

class CompanyRow {
  readonly elem: Locator
  readonly noOfUsers: Locator
  readonly editBtn: Locator

  constructor(row: Locator) {
    this.elem = row
    this.noOfUsers = this.elem.locator('td').nth(1)
    this.editBtn = this.elem.locator('td').nth(6).locator('a')
  }
  async coId() {
    const href = await this.elem
      .locator('td')
      .first()
      .locator('a')
      .getAttribute('href')
    const path = href.split('/')
    return path[path.length - 1]
  }
  async coName() {
    return await this.elem
      .locator('td')
      .first()
      .locator('a')
      .getAttribute('aria-label')
  }
}

export class CompaniesPage {
  readonly page: Page
  readonly sidenav: SidenavPanel
  readonly mainpanel: MainPanel
  readonly addCoForm: AddCompanyForm
  readonly addCoBtn: Locator
  readonly addRhCompanyOption: Locator
  readonly addMarketplaceCompanyOption: Locator
  readonly coSectionHeading: Locator
  readonly coCount: Locator
  readonly cosTable: EntityTable
  readonly editForm: EditCompanyForm

  constructor(page: Page) {
    this.page = page
    this.sidenav = new SidenavPanel(page)
    this.mainpanel = new MainPanel(page)
    this.addCoBtn = this.page.getByText('Add company')
    this.coSectionHeading = this.mainpanel.sectionHeading
    this.coCount = this.mainpanel.panel.locator('.chakra-badge', {
      hasText: /total$/
    })
    this.cosTable = new EntityTable(this.mainpanel.panel.locator('table'))
    this.addCoForm = new AddCompanyForm(this.page)
    this.editForm = new EditCompanyForm(this.page)
  }
  async clickCo(coName) {
    await this.cosTable.table
      .getByRole('link')
      .filter({ hasText: coName })
      .click()
    return new CompanyPage(this.page)
  }
  /**
   * Find a company in the Companies table by the name of the company
   * @param name - The name of the company
   * @returns CompanyRow - a CompanyRow representing the row in the table
   */
  async companyRow(name) {
    return new CompanyRow(
      this.cosTable.table.getByRole('row').filter({ hasText: name })
    )
  }
  async lastCompany() {
    return new CompanyRow(this.cosTable.allRows.last())
  }
  async goto(page = 0, size = 50) {
    await this.page.goto(`/companies?page=${page}&size=${size}`)
  }
}
