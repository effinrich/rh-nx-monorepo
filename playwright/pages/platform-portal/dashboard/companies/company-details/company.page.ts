import { AddUserForm } from '../../users/add-user.form'
import { EditCompanyForm } from './edit.form'
import { Locator, Page } from '@playwright/test'
import { Privacy } from './infrastructure/privacy.form'
import { TechStack } from './infrastructure/tech-stack.form'
import { Infrastructure } from './infrastructure/infrastructure.tab'
import { Overview } from './overview.tab'
import { Users } from './users.tab'
import { SidenavPanel } from '../../dashboard.page'
import { ErrorPage } from '../../../error.page'

class CompanyPageHeader {
  readonly page: Page
  readonly mainPanel: Locator
  readonly heroimg: Locator
  readonly coBreadcrumb: Locator
  readonly coName: Locator
  readonly coNumber: Locator
  readonly editCoBtn: Locator
  readonly addUserBtn: Locator
  readonly tabList: Locator

  constructor(page: Page) {
    this.page = page
    this.mainPanel = this.page.locator('main')
    this.heroimg = this.mainPanel.locator('image')
    this.coBreadcrumb = this.mainPanel.getByRole('link', { name: 'Companies' })
    this.coName = this.mainPanel.locator('h1 div div').first()
    this.coNumber = this.mainPanel.locator('h1 + p')
    this.editCoBtn = this.mainPanel
      .getByRole('link', { name: 'Edit company', exact: true })
      .first()
    this.addUserBtn = this.mainPanel
      .getByRole('link', { name: 'Add user', exact: true })
      .first()
    this.tabList = this.mainPanel.getByRole('tablist')
  }
}

export class CompanyPage {
  readonly page: Page
  readonly header: CompanyPageHeader
  readonly sidenav: SidenavPanel
  readonly mainPanel: Locator
  private tablist: Locator
  readonly getStartedTabBtn: Locator
  readonly getStartedTab: Overview
  readonly usersTabBtn: Locator
  readonly usersTab: Users
  readonly infrastructureTabBtn: Locator
  readonly infrastructureTab: Infrastructure
  private tabPanel: Locator
  readonly editForm: EditCompanyForm
  readonly addUserForm: AddUserForm

  constructor(page: Page) {
    this.page = page
    this.header = new CompanyPageHeader(this.page)
    this.sidenav = new SidenavPanel(page)
    this.mainPanel = this.page.locator('main')
    this.tablist = this.mainPanel.getByRole('tablist')
    this.getStartedTabBtn = this.tablist.getByText('Overview')
    this.usersTabBtn = this.tablist.getByText('Users')
    this.infrastructureTabBtn = this.tablist.getByText('Infrastructure')
    this.tabPanel = this.mainPanel.locator('.chakra-tabs__tab-panels')
    this.getStartedTab = new Overview(this.page, this.tabPanel)
    this.usersTab = new Users(this.page, this.tabPanel)
    this.infrastructureTab = new Infrastructure(this.page, this.tabPanel)
    this.editForm = new EditCompanyForm(this.page)
    this.addUserForm = new AddUserForm(this.page)
  }
  async goto(coId) {
    await this.page.goto(`/companies/${coId}/overview`)
  }
  async gotoInfrastructureTab(coId) {
    await this.page.goto(`/companies/${coId}/infrastructure`)
  }
  async gotoAddUser(coId) {
    await this.page.goto(`/companies/${coId}/overview?modal=add-user`)
  }
  async gotoEditCompany(coId) {
    await this.page.goto(`/companies/${coId}/edit`)
  }
  async clickUsersTab() {
    await this.usersTabBtn.click()
  }
  async clickInfrastructureTab() {
    await this.infrastructureTabBtn.click()
  }
  async error() {
    return new ErrorPage(this.page)
  }
  async startPrivacy(input) {
    await this.infrastructureTabBtn.click()
    await this.infrastructureTab.privacyQuestionnaire.startBtn.click()
    const privacyForm = new Privacy(this.page)
    await privacyForm.fillout(input)
    return privacyForm
  }
  async startTechStack(input) {
    await this.infrastructureTabBtn.click()
    await this.infrastructureTab.techStackQuestionnaire.startBtn.click()
    const techStackFrom = new TechStack(this.page)
    await techStackFrom.fillout(input)
    return techStackFrom
  }
  async draftPrivacy(input) {
    const privacyForm = await this.startPrivacy(input)
    await privacyForm.saveDraftBtn.click()
  }
  async draftTechStack(input) {
    const techStackForm = await this.startTechStack(input)
    await techStackForm.saveDraftBtn.click()
  }
  async reviewDraftPrivacy() {
    await this.infrastructureTab.privacyQuestionnaire.continueEditingBtn.click()
    const privacyForm = new Privacy(this.page)
    const data = await privacyForm.read()
    await privacyForm.xcloseBtn.click()
    return data
  }
  async reviewDraftTechStack() {
    await this.infrastructureTab.techStackQuestionnaire.continueEditingBtn.click()
    const techStackForm = new TechStack(this.page)
    const data = await techStackForm.read()
    await techStackForm.xcloseBtn.click()
    return data
  }
  async reviewPrivacy() {
    await this.infrastructureTab.privacyQuestionnaire.reviewSelectionsBtn.click()
    const privacyForm = new Privacy(this.page)
    const data = await privacyForm.read()
    await privacyForm.xcloseBtn.click()
    return data
  }
  async reviewTechStack() {
    await this.infrastructureTab.techStackQuestionnaire.reviewSelectionsBtn.click()
    const techStackForm = new TechStack(this.page)
    const data = await techStackForm.read()
    await techStackForm.xcloseBtn.click()
    return data
  }
  async submitPrivacy(input) {
    const privacyForm = await this.startPrivacy(input)
    await privacyForm.doneBtn.click()
  }
  async submitTechStack(input) {
    const techStackForm = await this.startTechStack(input)
    await techStackForm.doneBtn.click()
  }
  async submitInfraRequest() {
    await this.clickInfrastructureTab()
    await this.infrastructureTab.submitBtn.click()
    await this.page.getByRole('button', { name: 'Yes, Submit' }).click()
  }
}
