import { expect } from '@playwright/test'
import { portalTest } from '../../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  createCompany,
  deleteCompany
} from '../../../../../../../../utils/platform/company'

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Company Details page - Admin', () => {
  let apiContext
  let coData
  let coId

  portalTest.beforeEach(async ({}, testInfo) => {
    coData = {
      name: `Test: ${testInfo.title}`,
      number: 6830590 + parseInt(testInfo.title.substring(0, 1)),
      description:
        `Testing that the Admin User can see the ` +
        `company landing page\n` +
        testInfo.title
    }
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    const resp = await createCompany(apiContext, coData)
    expect(resp.status()).toBe(201)
    const postRespJson = await resp.json()
    expect(postRespJson.id).toBeTruthy()
    coId = postRespJson.id
  })

  portalTest.afterEach(async () => {
    await deleteCompany(apiContext, coId)
    await apiContext.dispose()
  })

  /**
   * 09/25/2023 - Disabling this test until it can be fixed for UI changes
   * https://redesignhealth.atlassian.net/jira/software/c/projects/PUD/issues/PUD-613
   */
  portalTest.fixme(
    '1. Admin can see company Overview tab @fixme',
    async ({ signInAdmin, coPage }) => {
      await coPage.goto(coId)
      await expect(coPage.getStartedTab.tabPanel).toBeAttached()
      await expect
        .soft(coPage.getStartedTab.tabPanel)
        .toHaveScreenshot('overview-tab.png')
    }
  )
  portalTest.fixme(
    '2. Admin can see company Users tab',
    async ({ signInAdmin, coPage }) => {
      // 10/19/2023 - skipping this test due to
      // https://redesignhealth.atlassian.net/browse/PUD-870
      await coPage.goto(coId)
      await coPage.clickUsersTab()
      await expect(coPage.usersTab.loadingSpinner).not.toBeVisible()
      await expect(coPage.usersTab.addUserBtn).toBeVisible()
      await expect
        .soft(coPage.usersTab.tabPanel)
        .toHaveScreenshot('people-tab.png')
    }
  )
  portalTest(
    '3. Admin can see company Infrastructure tab',
    async ({ signInAdmin, coPage }) => {
      await coPage.goto(coId)
      await coPage.clickInfrastructureTab()
      await expect(coPage.infrastructureTab.tabPanel).toBeVisible()
      await expect
        .soft(coPage.infrastructureTab.tabPanel)
        .toHaveScreenshot('infra-tab.png')
    }
  )
})
