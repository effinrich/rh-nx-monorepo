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
  testCEOData,
  testCEOGenerator
} from '../../../../utils/platform/ceo'
import { ROLES } from '../../../../data/platform/users'

portalTest.describe.configure({ mode: 'serial' })
// 10/24/2023 - change this to parallel when there's a fix for
// https://redesignhealth.atlassian.net/browse/PUD-806
let apiContext: APIRequestContext
let ceo: CEOSummary
let opco: CompanySummary
let person: PersonSummary

portalTest.describe('Edit CEO form', () => {
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
      email: person.email
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
    'Admin can open edit CEO form',
    async ({ signInAdmin, ceoDirectory, ceoProfile }) => {
      await ceoDirectory.gotoProfile(ceo.id)
      await ceoProfile.editBtn.click()
      await expect(ceoProfile.page).toHaveURL(/\/edit$/)
      await expect(ceoProfile.editForm.heading).toHaveText('Edit profile')
    }
  )

  portalTest(
    'RH User cannot edit CEO',
    async ({ signInRHUser, ceoDirectory, ceoProfile }) => {
      await ceoDirectory.gotoProfile(ceo.id)
      await expect(ceoProfile.editBtn).not.toBeVisible()
    }
  )

  portalTest(
    'Company user cannot edit CEO',
    async ({ signInCoUser, ceoDirectory, ceoProfile }) => {
      await ceoDirectory.gotoProfile(ceo.id)
      await expect(ceoProfile.editBtn).not.toBeVisible()
    }
  )

  portalTest.describe(() => {
    let ceo2: CEOSummary
    let opco2: CompanySummary
    let person2: PersonSummary

    portalTest.beforeEach(async () => {
      person2 = await testPersonGenerator(apiContext, {
        role: ROLES.coUser.authority
      })
      opco2 = await testCompanyGenerator(apiContext)
      let resp = await addMemberToCompany(apiContext, opco2.id, person2.email)
      expect(resp.status()).toBe(200)
      const ceoData = testCEOData({
        email: person2.email
      })
      ceo2 = await testCEOGenerator(apiContext, ceoData)
    })

    portalTest.afterEach(async () => {
      await deleteCEO(apiContext, ceo2.id)
      await deletePerson(apiContext, person2.email)
      await deleteCompany(apiContext, opco2.id)
    })

    portalTest(
      'CEO cannot edit another CEO',
      async ({ ceoDirectory, ceoProfile }) => {
        await ceoDirectory.goto()
        await impersonate(ceoDirectory, person2)
        await ceoDirectory.gotoProfile(ceo.id)
        await expect(ceoProfile.editBtn).not.toBeVisible()
      }
    )
  })
})
