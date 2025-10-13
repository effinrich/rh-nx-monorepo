import { APIRequestContext, expect } from '@playwright/test'
import { portalTest } from '../../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  addMemberToCompany,
  deleteCompany,
  testCompanyGenerator
} from '../../../../../../../../utils/platform/company'
import { impersonate } from '../../../../../../../../utils/platform/utils'
import { testPersonGenerator } from '../../../../../../../../utils/platform/person'

/**
 * 09/25/2023 - Disabling this test until it can be updated due to changes in UI
 * see: https://redesignhealth.atlassian.net/jira/software/c/projects/PUD/issues/PUD-613
 */

const TEST_CASES = ['NOT_STARTED', 'DRAFT', 'COMPLETED']

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe.fixme('Overview section', () => {
  portalTest.setTimeout(60000)
  let apiContext: APIRequestContext
  let opco: CompanySummary
  let person: PersonSummary

  portalTest.beforeEach(async ({ coPage, dashboard }, testInfo) => {
    const status = testInfo.title.split(' ').pop()
    const id = Date.now() + Math.floor(Math.random() * 99999)
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    opco = await testCompanyGenerator(apiContext, {
      name: `Test: ${testInfo.title}`,
      number: id,
      description: `Testing the 'Overview' tab:
      Privacy & Tech stack status: ${status}`,
      createGFolder: true
    })

    person = await testPersonGenerator(apiContext, {
      givenName: 'Test',
      familyName: 'GetStarted',
      role: 'ROLE_RH_USER',
      email: `test_getStarted_${id}@redesignhealth.com`
    })

    let resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)

    await dashboard.goto()
    await impersonate(coPage, person)
  })

  portalTest.afterEach(async () => {
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  for (const status of TEST_CASES) {
    portalTest(`privacy & techStack status: ${status}`, async ({ coPage }) => {
      await expect(coPage.getStartedTab.tabPanel).toBeAttached({
        timeout: 3000
      })
      await expect
        .soft(coPage.getStartedTab.infrastructureSetupSection.elem)
        .toHaveScreenshot(`${status}.png`)
    })
  }
})
