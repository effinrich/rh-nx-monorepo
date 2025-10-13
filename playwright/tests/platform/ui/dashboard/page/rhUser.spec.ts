import { expect } from '@playwright/test'
import { PLATFORM_USERS } from '../../../../../data/platform/users'
import { portalTest } from '../../../../../fixtures/platform-ui-test'
import {
  createCompany,
  deleteCompany,
  newAPIContext
} from '../../../../../utils/platform/company'

// Figma
// https://www.figma.com/file/3TjPei1XxNoAItGhumZyxg/Platform-Portal---Design-SSOT?node-id=1799%3A37329&t=qmONFmyrua86t7p4-0*

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Companies', () => {
  let apiContext
  let coData
  let coId

  portalTest.beforeEach(async ({}, testInfo) => {
    const id = Date.now() + Math.floor(Math.random() * 9999)
    coData = {
      name: `Test: ${testInfo.title}`,
      number: id + testInfo.title.length,
      legalName: 'Test Legal Name: ' + id,
      description: 'Test description... \n' + testInfo.title
    }
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    const resp = await createCompany(apiContext, coData)
    expect(resp.status()).toBe(201)
    const json = await resp.json()
    await expect(json.id).toBeTruthy()
    coId = json.id
  })

  portalTest.afterEach(async () => {
    await deleteCompany(apiContext, coId)
    await apiContext.dispose()
  })

  portalTest(
    'Dashboard sidenav & main panel',
    async ({ signInRHUser, dashboard }) => {
      await expect.soft(dashboard.sidenav.logoIcon).toBeVisible()
      await expect.soft(dashboard.sidenav.homeBtn).toBeVisible()
      await expect.soft(dashboard.sidenav.companiesBtn).toBeVisible()
      await expect.soft(dashboard.sidenav.usersBtn).toHaveCount(0)
      await expect.soft(dashboard.sidenav.usersBtn).not.toBeVisible()
      await expect.soft(dashboard.sidenav.libraryBtn).toBeVisible()
      await expect.soft(dashboard.sidenav.researchHubBtn).toBeVisible()
      await expect.soft(dashboard.sidenav.developersBtn).toBeVisible()
      await expect.soft(dashboard.sidenav.supportAndFeedbackBtn).toBeVisible()
      await expect.soft(dashboard.sidenav.username).toBeVisible()
      await expect
        .soft(dashboard.sidenav.username)
        .toHaveText(
          `${PLATFORM_USERS.rhUser.givenName} ${PLATFORM_USERS.rhUser.familyName}`
        )
      await expect.soft(dashboard.sidenav.logoutBtn).toBeVisible()
      await expect
        .soft(dashboard.mainpanel.panel)
        .toHaveScreenshot('main-panel.png')
    }
  )

  portalTest(
    'RH User can click "Companies" button in sidenav',
    async ({ signInRHUser, dashboard, companiesPage }) => {
      await dashboard.sidenav.companiesBtn.click()
      await expect(companiesPage.mainpanel.heading).toHaveText('Companies')
      await expect(companiesPage.cosTable.table).toBeVisible()
    }
  )
})

portalTest(
  'RH User can click "Home" button in sidenav',
  async ({ signInRHUser, dashboard, baseURL }) => {
    await dashboard.sidenav.libraryBtn.click()
    await dashboard.sidenav.homeBtn.click()
    await expect(dashboard.page).toHaveURL(baseURL)
  }
)

portalTest(
  'RH User can click "Library" button in sidenav',
  async ({ signInRHUser, dashboard, library }) => {
    await dashboard.sidenav.libraryBtn.click()
    await expect(library.mainpanel.heading).toHaveText('Library')
    await expect(library.searchbox.wrapper).toBeVisible()
  }
)

portalTest(
  'RH User can click "Research Hub" button in sidenav',
  async ({ signInRHUser, dashboard, researchHub }) => {
    await dashboard.sidenav.researchHubBtn.click()
    await expect(researchHub.addResearchBtn).toBeVisible()
  }
)

portalTest(
  'RH User can click "CEO Directory" button in sidenav',
  async ({ signInRHUser, dashboard, ceoDirectory }) => {
    await dashboard.sidenav.ceoDirectoryBtn.click()
    await expect(ceoDirectory.pageHeading).toHaveText('CEO Directory')
    await expect(ceoDirectory.searchbox).toBeVisible()
  }
)

portalTest(
  'RH User can click "Developer Tools" button in sidenav',
  async ({ signInRHUser, dashboard, developers }) => {
    await dashboard.sidenav.developersBtn.click()
    await expect(developers.mainpanel.heading).toHaveText('Developer Tools')
    await expect(developers.searchbox.wrapper).toBeVisible()
  }
)

portalTest(
  'RH User can click "Support & Feedback" button in sidenav',
  async ({ signInRHUser, dashboard, supportPage }) => {
    await dashboard.sidenav.supportAndFeedbackBtn.click()
    await expect(supportPage.mainpanel.heading).toHaveText('Support Center')
  }
)

portalTest(
  'RH User cannot see "Vendors" button in sidenav',
  async ({ signInRHUser, dashboard }) => {
    await expect(dashboard.sidenav.vendorsBtn).not.toBeVisible()
  }
)
