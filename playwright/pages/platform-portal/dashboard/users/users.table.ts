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

class UserRow {
  readonly row: Locator
  readonly avatar: Locator
  readonly firstName: Locator
  readonly lastName: Locator
  readonly email: Locator
  readonly type: Locator
  readonly dateAdded: Locator
  readonly lastActive: Locator
  readonly company: Locator
  readonly deleteBtn: Locator
  readonly editBtn: Locator

  constructor(row: Locator) {
    this.row = row
    this.avatar = this.row.locator('')
    this.firstName = this.row.locator('')
    this.lastName = this.row.locator('')
    this.email = this.row.locator('')
    this.type = this.row.locator('')
    this.dateAdded = this.row.locator('')
    this.lastActive = this.row.locator('')
    this.company = this.row.locator('')
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

class UsersTable {
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

  clickPreviousBtn() {
    this.footer.previousBtn.click()
  }
  clickLeftPageNumberBtn() {
    this.footer.pageNumberBtnLeft.click()
  }
  clickRightPageNumberBtn() {
    this.footer.pageNumberBtnRight.click()
  }
  clickNextBtn() {
    this.footer.nextBtn.click()
  }
}
