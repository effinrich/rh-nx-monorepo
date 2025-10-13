import { Locator, Page } from '@playwright/test'
import { AddUserForm } from './add-user.form'
import { EditUserForm } from './edit-user.form'
import { EntityTable } from '../../components/entityTable'
import { ErrorPage } from '../../error.page'
import { MainPanel, SidenavPanel } from '../dashboard.page'

class UserRow {
  readonly row: Locator
  readonly name: Locator
  readonly email: Locator
  readonly userType: Locator
  readonly dateAdded: Locator
  readonly company: Locator
  readonly editBtn: Locator

  constructor(row: Locator) {
    this.row = row
    this.name = row.locator('td').first().locator('p').first()
    this.email = row.locator('td').first().locator('p').nth(2)
    this.userType = row.locator('td').nth(2)
    this.dateAdded = row.locator('td').nth(3)
    this.company = row.locator('td').nth(4)
    this.editBtn = row.getByRole('button', { name: /Edit/ })
  }
}

class UsersTable extends EntityTable {
  constructor(table: Locator) {
    super(table)
  }
  async findUserRow(email) {
    return new UserRow(
      this.table.locator('tbody').locator('tr', { hasText: email })
    )
  }
}
export class UsersPage {
  readonly page: Page
  readonly sidenav: SidenavPanel
  readonly mainpanel: MainPanel
  readonly addUserForm: AddUserForm
  readonly addUserBtn: Locator
  readonly userSectionHeading: Locator
  readonly userCount: Locator
  readonly usersTable: UsersTable
  readonly editUserForm: EditUserForm
  readonly errorPage: ErrorPage

  constructor(page: Page) {
    this.page = page
    this.sidenav = new SidenavPanel(page)
    this.mainpanel = new MainPanel(page)
    this.addUserBtn = this.page.getByRole('button', { name: 'Add user' })
    this.userSectionHeading = this.mainpanel.sectionHeading
    this.userCount = this.mainpanel.panel.locator('h2 + .chakra-badge')
    this.usersTable = new UsersTable(this.mainpanel.panel.locator('table'))
    this.addUserForm = new AddUserForm(this.page)
    this.editUserForm = new EditUserForm(this.page)
    this.errorPage = new ErrorPage(this.page)
  }
  async goto(pageNumber = 0, size = 9999) {
    await this.page.goto(`/users?page=${pageNumber}&size=${size}`)
  }
  async gotoAddUserForm() {
    await this.page.goto('/users/add-user')
  }
  async clickAddUserBtn() {
    await this.addUserBtn.click()
  }
  async gotoEditUserForm(email) {
    await this.page.goto(`/users/edit-user/${email}`)
  }
}
