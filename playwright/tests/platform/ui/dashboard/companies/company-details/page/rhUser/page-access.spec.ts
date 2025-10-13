import { expect } from '@playwright/test'
import { PLATFORM_USERS } from '../../../../../../../../data/platform/users'
import { portalTest } from '../../../../../../../../fixtures/platform-ui-test'
import {
  createCompany,
  deleteCompany,
  newAPIContext,
  // newCompanyWithMember
} from '../../../../../../../../utils/platform/company'

portalTest.describe('Company Detail page - RH User', () => {
  portalTest.setTimeout(60000)
  let apiContext
  let coData
  let coId

  portalTest.beforeEach(async ({}, testInfo) => {
    const i = parseInt(testInfo.title.substring(0, 1))
    coData = {
      name: `Test: ${testInfo.title}`,
      number: 167634968200 + i,
      description: `Test: ${testInfo.title}`
    }
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
  })

  portalTest.afterEach(async () => {
    await deleteCompany(apiContext, coId)
    await apiContext.dispose()
  })

  /**
   * 09/25/2023 - Disabling this test until it can be fixed for UI changes
   * https://redesignhealth.atlassian.net/jira/software/c/projects/PUD/issues/PUD-613
   */
  portalTest.describe.fixme('Positive Tests', async () => {
    portalTest.beforeEach(async () => {
      // coId = await newCompanyWithMember(
      //   apiContext,
      //   coData,
      //   PLATFORM_USERS.rhUser.email
      // )
    })

    portalTest(
      '1. RH User can see company landing page',
      async ({ signInRHUser, coPage }) => {
        await coPage.goto(coId)
        await expect(coPage.getStartedTab.tabPanel).toBeAttached()
        await expect
          .soft(coPage.mainPanel)
          .toHaveScreenshot('company-detail-landing.png')
      }
    )
  })

  portalTest.describe('Negative Tests', () => {
    portalTest.beforeEach(async () => {
      const resp = await createCompany(apiContext, coData)
      expect(resp.status()).toBe(201)
      const json = await resp.json()
      coId = json.id
    })

    portalTest.fixme(
      '3. RH User cannot see landing page for company they are not a member of',
      async ({ signInRHUser, coPage }) => {
        // 10/19/2023 - disabling this test since it gets a forever spinner
        // instead of 403
        await coPage.goto(coId)
        const errorPage = await coPage.error()
        await expect(errorPage.heading).toHaveText(/403 error/)
        // BUG:  https://redesignhealth.atlassian.net/browse/PDEV-101
        // Incorrect error page for 403 error
        await expect(errorPage.page).toHaveScreenshot('403-error.png')
      }
    )
  })
})
