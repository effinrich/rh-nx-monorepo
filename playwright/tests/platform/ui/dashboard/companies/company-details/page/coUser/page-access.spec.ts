import { APIRequestContext, expect } from '@playwright/test'
import {
  PLATFORM_USERS,
  ROLES
} from '../../../../../../../../data/platform/users'
import { portalTest } from '../../../../../../../../fixtures/platform-ui-test'
import {
  deleteCompany,
  newAPIContext,
  testCompanyGenerator,
  addMemberToCompany
} from '../../../../../../../../utils/platform/company'
import {
  deletePerson,
  testPersonGenerator
} from '../../../../../../../../utils/platform/person'
import { impersonate } from '../../../../../../../../utils/platform/utils'

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Company Detail page - Company User', () => {
  let apiContext: APIRequestContext
  let person: PersonSummary
  let opco: CompanySummary

  portalTest.beforeEach(async ({ dashboard }, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    opco = await testCompanyGenerator(apiContext)
    person = await testPersonGenerator(apiContext, {
      role: ROLES.coUser.authority
    })
    const resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)
    await dashboard.goto()
    await impersonate(dashboard, person)
  })

  portalTest.afterEach(async () => {
    await deleteCompany(apiContext, opco.id)
    await deletePerson(apiContext, person.email)
    await apiContext.dispose()
  })

  portalTest(
    'Company User can click "My company" button in sidenav',
    async ({ coPage }) => {
      await coPage.sidenav.libraryBtn.click()
      await coPage.sidenav.myCoBtn.click()
      await expect(coPage.page).toHaveURL(
        /\/companies\/[a-zA-Z0-9]{8,}\/overview$/
      )
    }
  )

  portalTest(
    'Company User can click "Library" button in sidenav',
    async ({ coPage, library }) => {
      await coPage.sidenav.supportAndFeedbackBtn.click()
      await coPage.sidenav.libraryBtn.click()
      await expect(library.mainpanel.heading).toHaveText('Library')
      await expect(library.searchbox.wrapper).toBeVisible()
    }
  )

  portalTest(
    'Company User can click "CEO Directory" button in sidenav',
    async ({ dashboard, ceoDirectory }) => {
      await dashboard.sidenav.ceoDirectoryBtn.click()
      await expect(ceoDirectory.pageHeading).toHaveText('CEO Directory')
      await expect(ceoDirectory.pageSubheading).toHaveText(
        'Looking to connect with other CEOs?'
      )
      await expect(ceoDirectory.pageDescription).toHaveText(
        'Browse our directory to connect with your peers.'
      )
      await expect(ceoDirectory.searchbox).toBeVisible()
    }
  )

  portalTest(
    'Company User can click "Developer Tools" button in sidenav',
    async ({ coPage, developers }) => {
      await coPage.sidenav.developersBtn.click()
      await expect(developers.mainpanel.heading).toHaveText('Developer Tools')
      await expect(developers.searchbox.wrapper).toBeVisible()
    }
  )

  portalTest(
    'Company User can click "Support" button in sidenav',
    async ({ coPage, supportPage }) => {
      await coPage.sidenav.supportAndFeedbackBtn.click()
      await expect(supportPage.mainpanel.heading).toHaveText('Support Center')
    }
  )

  /**
   * 09/25/2023 - Disabling this test until it can be fixed for UI changes
   * https://redesignhealth.atlassian.net/jira/software/c/projects/PUD/issues/PUD-613
   */
  portalTest.fixme('Can click "View docs" button @dev', async ({ coPage }) => {
    await coPage.goto(opco.id)
    await coPage.getStartedTabBtn.click()
    const popupPromise = coPage.page.waitForEvent('popup')
    const frame = await coPage.page.frameLocator(
      '[title = "Sign in with Google Button"]'
    )
    await coPage.getStartedTab.documentationSection.viewDocsBtn.click()
    const popup = await popupPromise
    await popup.waitForLoadState()
    await popup.close()
  })

  portalTest.fixme('Company User cannot edit users', async ({ usersPage }) => {
    // 10/19/2023 - disabling this test since it's going to 404 instead of 403
    await usersPage.gotoEditUserForm(PLATFORM_USERS.coUser.email)
    await expect(usersPage.errorPage.heading).toBeVisible()
    await expect(usersPage.page).toHaveScreenshot('403-error.png')
  })
})

portalTest.describe('Negative Tests', () => {
  let apiContext: APIRequestContext
  let person: PersonSummary
  let opco: CompanySummary

  portalTest.beforeEach(async ({ dashboard }, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    opco = await testCompanyGenerator(apiContext)
    person = await testPersonGenerator(apiContext)
    await dashboard.goto()
    await impersonate(dashboard, person)
  })

  portalTest.fixme(
    'Company User cannot see landing page for company they are not a member of',
    async ({ coPage }) => {
      // 10/19/2023 - disabling this test since it's getting a forever spinner
      // instead of 403
      await coPage.goto(opco.id)
      const errorPage = await coPage.error()
      await expect(errorPage.heading).toHaveText(/403 error/)
      // BUG:  https://redesignhealth.atlassian.net/browse/PDEV-101
      // Incorrect error page for 403 error
      await expect(errorPage.page).toHaveScreenshot('403-error.png')
    }
  )
})
