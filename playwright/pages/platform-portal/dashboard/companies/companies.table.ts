import { Locator, Page } from '@playwright/test'

class TableFooter {
  readonly page: Page
  readonly previousBtn: Locator
  readonly pageNumberBtnLeft: Locator
  readonly pageNumberBtnRight: Locator
  readonly nextBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.previousBtn = this.page.locator('')
    this.pageNumberBtnLeft = this.page.locator('')
    this.pageNumberBtnRight = this.page.locator('')
    this.nextBtn = this.page.locator('')
  }
}

class companyRow {
  readonly row: Locator
  readonly name: Locator
  readonly number: Locator
  readonly status: Locator
  readonly numberOfUsers: Locator
  readonly deleteBtn: Locator
  readonly editBtn: Locator

  constructor(row: Locator) {
    this.row = row
    this.name = this.row.locator('')
    this.number = this.row.locator('')
    this.status = this.row.locator('')
    this.numberOfUsers = this.row.locator('')
    this.deleteBtn = this.row.locator('')
    this.editBtn = this.row.locator('')
  }

  delete() {
    this.deleteBtn.click()
  }

  edit() {
    this.editBtn.click()
  }
}

class CompaniesTable {
  readonly page: Page
  readonly sectionHeading: Locator
  readonly totalUsersCount: Locator
  readonly tableHeading: Locator
  readonly columns: Locator
  readonly rows: Locator
  readonly footer: TableFooter

  constructor(page: Page) {
    this.page = page
    this.sectionHeading = this.page.locator('')
    this.totalUsersCount = this.page.locator('')
    this.tableHeading = this.page.locator('')
    this.columns = this.page.locator('')
    this.rows = this.page.locator('')
    this.footer = new TableFooter(this.page)
  }
  async clickPreviousBtn() {
    await this.footer.previousBtn.click()
  }
  async clickLeftPageNumberBtn() {
    await this.footer.pageNumberBtnLeft.click()
  }
  async clickRightPageNumberBtn() {
    await this.footer.pageNumberBtnRight.click()
  }
  async clickNextBtn() {
    await this.footer.nextBtn.click()
  }
}
