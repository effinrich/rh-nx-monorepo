import { APIRequestContext, expect } from '@playwright/test'
import { portalTest } from '../../../../fixtures/platform-ui-test'
import {
  FundraiseStatus,
  addMemberToCompany,
  deleteCompany,
  newAPIContext,
  testCompanyGenerator
} from '../../../../utils/platform/company'
import { deleteCEO, testCEOGenerator } from '../../../../utils/platform/ceo'
import {
  deletePerson,
  testPersonGenerator
} from '../../../../utils/platform/person'
import { faker } from '@faker-js/faker'
import { impersonate, wait } from '../../../../utils/platform/utils'
import { ROLES } from '../../../../data/platform/users'

/**
 * Setup:
 *  - Create a Co user
 *  - Create an opco with fundraiseStatus != 'Pre launch phase'
 *  - Add user to opco
 *  - Create CEO profile for user with visible == 'OPT_IN'
 * Tests:
 * 1. Search by company name
 * 2. Search by CEO first name
 * 3. Search by CEO last name
 * 4. Search by CEO bio
 * 5. Search by CEO additional info
 * Expect:
 * 1. Specific card should be found
 * 2. All cards returned should match search term
 * Teardown:
 * - delete CEO profile
 * - delete Co user
 * - delete opco
 */
portalTest.describe.configure({ mode: 'serial' })
portalTest.describe('Search CEO Directory', () => {
  let apiContext: APIRequestContext
  let ceo: CEOSummary
  let opco: CompanySummary
  let person: PersonSummary

  portalTest.beforeEach(async ({ dashboard, ceoDirectory }, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    person = await testPersonGenerator(apiContext, {
      role: ROLES.coUser.authority
    })
    opco = await testCompanyGenerator(apiContext, {
      fundraiseStatus: FundraiseStatus.PRE_SERIES_A.value
    })
    const resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)
    ceo = await testCEOGenerator(apiContext, {
      email: person.email,
      bio: faker.person.bio(),
      additionalInfo: faker.company.buzzPhrase(),
      visible: 'OPT_IN'
    })

    await dashboard.goto()
    await impersonate(dashboard, person)
    // wait for search server to sync
    await wait(1000)
    await ceoDirectory.goto()
    await expect(ceoDirectory.firstCard).toBeVisible()
  })

  portalTest.afterEach(async () => {
    await deleteCEO(apiContext, ceo.id)
    await deletePerson(apiContext, person.email)
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  async function searchCEO(ceoDir, term) {
    await ceoDir.search(term)
    await expect(ceoDir.loadingSpinner).not.toBeVisible()
    expect.soft(await ceoDir.resultsCount()).toBeGreaterThanOrEqual(1)
    return await ceoDir.resultsCount()
  }

  portalTest('Search by CEO Company', async ({ ceoDirectory }) => {
    await searchCEO(ceoDirectory, opco.name)
    await expect(ceoDirectory.allCompanyNames.first()).toContainText(opco.name)
  })

  portalTest('Search by CEO name', async ({ ceoDirectory }) => {
    const ceoName = `${person.givenName} ${person.familyName}`
    await searchCEO(ceoDirectory, ceoName)
    await expect(ceoDirectory.allCEONames.first()).toContainText(ceoName)
  })
})
