import { APIRequestContext, expect } from '@playwright/test'
import {
  deleteCompany,
  testCompanyGenerator,
  newAPIContext,
  addMemberToCompany
} from '../../../../utils/platform/company'
import { deletePerson } from '../../../../utils/platform/person'

import { portalTest } from '../../../../fixtures/platform-ui-test'
import { testPersonGenerator } from '../../../../utils/platform/person'
import { impersonate } from '../../../../utils/platform/utils'
import {
  deleteCEO,
  mapCEOSummaryToProfilePage,
  testCEOData,
  testCEOGenerator
} from '../../../../utils/platform/ceo'
import { ROLES } from '../../../../data/platform/users'

/**
 * Setup:
 *  - Create a Co User via the API
 *  - Create an opco via the API
 *  - Add the Co User to the OpCo
 *  - Create a CEO profile via the API with visible == 'OPT_IN'
 * Test:
 *  1. Impersonate the Co User
 *  2. Open the CEO Profile
 *  3. Verify all CEO data on the profile matches
 *     what was input during the setup
 * Teardown:
 *  - Delete CEO Profile
 *  - Delete person
 *  - Delete opco
 */

portalTest.describe('CEO Directory', () => {
  let apiContext: APIRequestContext
  let ceo: CEOSummary
  let opco: CompanySummary
  let person: PersonSummary

  portalTest.beforeEach(async ({}, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    person = await testPersonGenerator(apiContext, {
      role: ROLES.coUser.authority
    })
    opco = await testCompanyGenerator(apiContext)
    let resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)
    const ceoData = testCEOData({
      email: person.email,
      visible: 'OPT_IN'
    })
    ceo = await testCEOGenerator(apiContext, ceoData)
  })

  portalTest.afterEach(async () => {
    await deleteCEO(apiContext, ceo.id)
    await deletePerson(apiContext, person.email)
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  portalTest(
    'Can view CEO Profile page',
    async ({ ceoDirectory, ceoProfile }) => {
      await ceoDirectory.goto()
      await impersonate(ceoDirectory, person)
      await ceoDirectory.viewMyProfileBtn.click()
      await expect(ceoDirectory.page).toHaveTitle(
        `CEO Profile Details: ${ceo.member.givenName} ${ceo.member.familyName}`
      )
      const actual = await ceoProfile.read()
      const expected = mapCEOSummaryToProfilePage(ceo)
      expect(actual).toStrictEqual(expected)
    }
  )
})

portalTest.describe('Non-CEO view', async () => {
  portalTest(
    'OpCo User does not see "View my profile" button',
    async ({ signInCoUser, ceoDirectory }) => {
      await ceoDirectory.goto()
      await expect(ceoDirectory.viewMyProfileBtn).not.toBeVisible()
    }
  )
})
