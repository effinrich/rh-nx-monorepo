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
import { ROLES } from '../../../../data/platform/users'
import { impersonate, wait } from '../../../../utils/platform/utils'
import { faker } from '@faker-js/faker'

/**
 * Setup:
 *  - Create a Co user1
 *  - Create a Co user2
 *  - Add user to opco
 *  - Create CEO1 profile for user with visible == 'OPT_IN'
 *  - Create CEO2 profile for user with visible == 'OPT_OUT'
 * Tests:
 * 1. CEO with 'OPT_IN' does not have indicator
 * 2. CEO with 'OPT_OUT' has indicator
 * Teardown:
 * - delete CEO1 profile
 * - delete CEO2 profile
 * - delete Co user1
 * - delete Co user2
 * - delete opco
 */
portalTest.describe.configure({ mode: 'serial' })
portalTest.describe(() => {
  let apiContext: APIRequestContext
  let ceo1: CEOSummary
  let ceo2: CEOSummary
  let opco: CompanySummary
  let person1: PersonSummary
  let person2: PersonSummary

  portalTest.beforeAll(async ({}, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    person1 = await testPersonGenerator(apiContext, {
      givenName: `${faker.person.firstName()}_${Date.now()}`,
      role: ROLES.coUser.authority
    })
    person2 = await testPersonGenerator(apiContext, {
      givenName: `${faker.person.firstName()}_${Date.now()}`,
      role: ROLES.coUser.authority
    })
    opco = await testCompanyGenerator(apiContext, {
      fundraiseStatus: FundraiseStatus.PRE_SERIES_A.value
    })
    let resp = await addMemberToCompany(apiContext, opco.id, person1.email)
    expect(resp.status()).toBe(200)
    resp = await addMemberToCompany(apiContext, opco.id, person2.email)
    expect(resp.status()).toBe(200)
    ceo1 = await testCEOGenerator(apiContext, {
      email: person1.email,
      visible: 'OPT_IN'
    })
    ceo2 = await testCEOGenerator(apiContext, {
      email: person2.email,
      visible: 'OPT_OUT'
    })
    await wait(1000)
  })

  portalTest.afterAll(async () => {
    await deleteCEO(apiContext, ceo1.id)
    await deleteCEO(apiContext, ceo2.id)
    await deletePerson(apiContext, person1.email)
    await deletePerson(apiContext, person2.email)
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  async function searchCEO(ceoDir, term) {
    await ceoDir.search(term)
    await expect(ceoDir.loadingSpinner).not.toBeVisible()
    expect.soft(await ceoDir.resultsCount()).toBeGreaterThanOrEqual(1)
    return await ceoDir.resultsCount()
  }

  portalTest(
    'Opt-out indicator not present',
    async ({ signInRHUser, ceoDirectory }) => {
      await ceoDirectory.goto()
      await searchCEO(
        ceoDirectory,
        `${ceo1.member.givenName} ${ceo1.member.familyName}`
      )
      const cards = await ceoDirectory.allCEOCards()
      await expect(cards[0].optOutIcon).toHaveCount(0)
    }
  )

  portalTest(
    'Opt-out indicator visible to RH User',
    async ({ signInRHUser, ceoDirectory }) => {
      await ceoDirectory.goto()
      await searchCEO(
        ceoDirectory,
        `${ceo2.member.givenName} ${ceo2.member.familyName}`
      )
      const cards = await ceoDirectory.allCEOCards()
      await expect(cards[0].optOutIcon).toBeVisible()
    }
  )

  portalTest(
    'Opt-out indicator visible to Admin',
    async ({ signInAdmin, ceoDirectory }) => {
      await ceoDirectory.goto()
      await searchCEO(
        ceoDirectory,
        `${ceo2.member.givenName} ${ceo2.member.familyName}`
      )
      const cards = await ceoDirectory.allCEOCards()
      await expect(cards[0].optOutIcon).toBeVisible()
    }
  )

  portalTest(
    'Opt-out CEO is hidden from Co User',
    async ({ signInCoUser, ceoDirectory }) => {
      await ceoDirectory.goto()
      await ceoDirectory.search(`${ceo2.member.givenName}`)
      await expect(ceoDirectory.loadingSpinner).not.toBeVisible()
      await expect(ceoDirectory.noCEOsFound).toHaveScreenshot('no-ceos.png')
    }
  )

  portalTest(
    'Opt-in CEO cannot see opt-out CEO',
    async ({ dashboard, ceoDirectory }) => {
      await dashboard.goto()
      await impersonate(dashboard, person1)
      await ceoDirectory.goto()
      await ceoDirectory.search(ceo2.member.givenName)
      await expect(ceoDirectory.loadingSpinner).not.toBeVisible()
      await expect(ceoDirectory.noCEOsFound).toHaveScreenshot('no-ceos.png')
    }
  )

  portalTest(
    'Opt-out CEO can see opt-in CEO',
    async ({ dashboard, ceoDirectory }) => {
      await dashboard.goto()
      await impersonate(dashboard, person2)
      await ceoDirectory.goto()
      await searchCEO(ceoDirectory, ceo1.member.givenName)
      const cards = await ceoDirectory.allCEOCards()
      const regex = new RegExp(`^${person1.givenName}`)
      await expect(cards[0].name).toHaveText(regex)
    }
  )
})
