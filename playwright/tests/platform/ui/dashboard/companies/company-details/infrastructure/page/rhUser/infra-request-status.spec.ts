import { expect } from '@playwright/test'
import { ROLES } from '../../../../../../../../../data/platform/users'
import { testPersonGenerator } from '../../../../../../../../../utils/platform/person'
import { portalTest } from '../../../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  deleteCompany,
  testCompanyGenerator,
  addMemberToCompany,
  updateCompanyInfraRequestStatus
} from '../../../../../../../../../utils/platform/company'
import { impersonate } from '../../../../../../../../../utils/platform/utils'
import { deletePerson } from '../../../../../../../../../utils/platform/person'

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Infra request status', () => {
  /**
   * https://redesignhealth.atlassian.net/browse/SRV-7
   *  - Make the alert persist once the infra request is submitted
   *  - Update the badge to say Pending, In progress, and Complete based on API response
   */
  const STATUSES = {
    Pending: 'PENDING',
    'In progress': 'IN_PROGRESS',
    Done: 'DONE',
    'Awaiting submission': 'AWAITING_SUBMISSION'
  }

  portalTest.describe('Infra request status', async () => {
    let apiContext
    let person: PersonSummary
    let opco: CompanySummary

    portalTest.beforeEach(async ({ dashboard, coPage }, testInfo) => {
      const id = 847893 + Math.floor(Math.random() * 9999)
      const coData = {
        name: `Test: Submit Infra Request ${id}`,
        number: id,
        description: `Test ${id} - submitting the privacy questionnaire and the tech stack`,
        legalName: `Test Legal Name ${id}`
      }
      apiContext = await newAPIContext(
        testInfo.config.metadata.apiURL,
        testInfo.config.metadata.jwt
      )
      person = await testPersonGenerator(apiContext, {
        role: ROLES.rhUser.authority
      })
      opco = await testCompanyGenerator(apiContext, coData)
      let resp = await addMemberToCompany(apiContext, opco.id, person.email)
      expect(resp.status()).toBe(200)

      resp = await addMemberToCompany(apiContext, opco.id, person.email)
      expect(resp.status()).toBe(200)

      resp = await updateCompanyInfraRequestStatus(
        apiContext,
        opco.id,
        STATUSES[testInfo.title]
      )
      expect(resp.status()).toBe(200)

      await dashboard.goto()
      await impersonate(dashboard, person)
      await coPage.gotoInfrastructureTab(opco.id)
    })

    portalTest.afterEach(async () => {
      await deletePerson(apiContext, person.email)
      await deleteCompany(apiContext, opco.id)
      await apiContext.dispose()
    })

    for (const status of Object.keys(STATUSES).slice(0, 3)) {
      portalTest(status, async ({ coPage }) => {
        await expect(
          coPage.infrastructureTab.statusAlert.elem
        ).toHaveScreenshot(`${status}.png`)
      })
    }
    portalTest('Awaiting submission', async ({ coPage }) => {
      await expect(coPage.infrastructureTab.statusAlert.elem).not.toBeVisible()
    })
  })
})
