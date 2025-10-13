import { Locator, Page } from '@playwright/test'
import { MainPanel, SidenavPanel } from '../dashboard/dashboard.page'
import { AddCallNoteForm } from './addCallNotes.form'
import { CallNotesTab } from './callNotes.tab'

export class ResearchHubPage {
  readonly page: Page
  readonly sidenav: SidenavPanel
  readonly mainpanel: MainPanel
  readonly addResearchBtn: Locator
  readonly researchReportOpt: Locator
  readonly callNotesOpt: Locator
  readonly externalContentOpt: Locator
  readonly researchReportsTabBtn: Locator
  readonly callNotesTabBtn: Locator
  readonly externalContentTabBtn: Locator
  readonly addCallNotesForm: AddCallNoteForm
  readonly callNotesTab: CallNotesTab

  constructor(page: Page) {
    this.page = page
    this.sidenav = new SidenavPanel(page)
    this.mainpanel = new MainPanel(page)
    this.addResearchBtn = this.page.getByRole('button', {
      name: 'Add Research'
    })
    this.researchReportOpt = this.page.getByRole('menuitem', {
      name: 'Research report'
    })
    this.callNotesOpt = this.page.getByRole('menuitem', {
      name: 'Call notes'
    })
    this.externalContentOpt = this.page.getByRole('menuitem', {
      name: 'External content'
    })
    this.researchReportsTabBtn = this.page.getByRole('tab', {
      name: 'Research reports'
    })
    this.callNotesTabBtn = this.page.getByRole('tab', { name: 'Call notes' })
    this.externalContentTabBtn = this.page.getByRole('tab', {
      name: 'External content'
    })
    this.addCallNotesForm = new AddCallNoteForm(
      this.page,
      this.page.locator('.chakra-modal__content')
    )
    this.callNotesTab = new CallNotesTab(this.page.locator('[id$="tabpanel-1"]'))
  }

  async goto() {
    await this.page.goto('/research-hub')
  }

  async openAddCallNotesForm() {
    await this.addResearchBtn.click()
    await this.callNotesOpt.click()
  }
}
