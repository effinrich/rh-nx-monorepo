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
import {
  deleteCEO,
  getCEO,
  testCEOData,
  testCEOGenerator
} from '../../../../utils/platform/ceo'
import { ROLES } from '../../../../data/platform/users'
import { impersonate } from '../../../../utils/platform/utils'
import {
  businessFocusAreas,
  customerSegments,
  healthcareSectors
} from '../../../../data/platform/ceos'

/**
 * Setup:
 *  - Create a Co User via the API
 *  - Create an opco via the API
 *  - Add the Co User to the OpCo
 *  - Create a CEO profile for the user
 * Test:
 *  1. Impersonate the CEO
 *  2. Open the Edit Profile page for the CEO
 *  3. Fill out & submit the form
 *  3. Check data persistence
 * Teardown:
 *  - Delete CEO Profile
 *  - Delete person
 *  - Delete opco
 */

portalTest.describe(() => {
  let apiContext: APIRequestContext
  let ceo: CEOSummary
  let opco: CompanySummary
  let person: PersonSummary
  let initialCEOData: CEOCommand

  portalTest.beforeAll(async ({}, testInfo) => {
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
    initialCEOData = testCEOData({
      email: person.email
    })
    ceo = await testCEOGenerator(apiContext, initialCEOData)
  })

  portalTest.afterAll(async () => {
    await deleteCEO(apiContext, ceo.id)
    await deletePerson(apiContext, person.email)
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  portalTest(
    'CEO can edit their profile',
    async ({ ceoDirectory, ceoProfile }) => {
      await ceoDirectory.goto()
      await impersonate(ceoDirectory, person)
      await ceoProfile.editForm.goto(ceo.id)
      await expect(
        ceoProfile.editForm.marketServiceArea.control.wrapper
      ).toBeVisible()
      const updateCEOInput = testCEOData()
      delete updateCEOInput.email
      if (updateCEOInput.pictureHref) {
        delete updateCEOInput.pictureHref
      }

      // check that the edit page loaded with the correct values
      const actual = await ceoProfile.editForm.read()
      expect
        .soft(actual['name'])
        .toBe(`${ceo.member.givenName} ${ceo.member.familyName}`)
      expect.soft(actual['companyName']).toBe(opco.name)
      expect.soft(actual['email']).toBe(ceo.member.email)
      if (initialCEOData.location) {
        expect.soft(actual['location']).toBe(initialCEOData.location)
      } else {
        expect.soft(actual['location']).toBe(null)
      }
      if (initialCEOData.bio) {
        expect.soft(actual['bio']).toBe(initialCEOData.bio)
      } else {
        expect.soft(actual['bio']).toBe('')
      }
      if (initialCEOData.additionalInfo) {
        expect
          .soft(actual['additionalInfo'])
          .toBe(initialCEOData.additionalInfo)
      } else {
        expect.soft(actual['additionalInfo']).toBe('')
      }
      if (initialCEOData.linkedinHref) {
        expect.soft(actual['linkedinHref']).toBe(initialCEOData.linkedinHref)
      } else {
        expect.soft(actual['linkedinHref']).toBe('')
      }
      if (initialCEOData.visible) {
        expect.soft(actual['visible']).toBe(initialCEOData.visible)
      } else {
        expect.soft(actual['visible']).toBe(null)
      }
      expect.soft(actual['businessType']).toBe(initialCEOData.businessType)
      if (initialCEOData.customerSegment) {
        expect
          .soft(actual['customerSegment'].sort())
          .toStrictEqual(
            initialCEOData.customerSegment.map(x => customerSegments[x]).sort()
          )
      } else {
        expect.soft(actual['customerSegment']).toStrictEqual([])
      }
      if (initialCEOData.healthcareSector) {
        expect
          .soft(actual['healthcareSector'])
          .toBe(healthcareSectors[initialCEOData.healthcareSector])
      } else {
        expect.soft(actual['healthcareSector']).toBe(null)
      }
      if (initialCEOData.businessFocusArea) {
        expect
          .soft(actual['businessFocusArea'])
          .toStrictEqual(
            initialCEOData.businessFocusArea.map(x => businessFocusAreas[x])
          )
      } else {
        expect.soft(actual['businessFocusArea']).toStrictEqual([])
      }
      if (initialCEOData.marketServiceArea) {
        expect
          .soft(actual['marketServiceArea'])
          .toStrictEqual(initialCEOData.marketServiceArea)
      } else {
        expect.soft(actual['marketServiceArea']).toStrictEqual([])
      }

      if (updateCEOInput.customerSegment && initialCEOData.customerSegment) {
        await expect(
          ceoProfile.editForm.customerSegment.control.checked
        ).toHaveCount(initialCEOData.customerSegment.length)
        // uncheck previously checked values
        await ceoProfile.editForm.fillout({
          customerSegment: initialCEOData.customerSegment
        })
      }
      if (
        updateCEOInput.businessFocusArea?.length > 0 &&
        initialCEOData.businessFocusArea?.length > 0
      ) {
        await ceoProfile.editForm.businessFocusArea.control.clearAll()
      }
      if (initialCEOData.marketServiceArea?.length > 0) {
        await ceoProfile.editForm.marketServiceArea.control.clearAll()
      }

      // edit the CEO data
      await ceoProfile.editForm.editCEO(updateCEOInput)
      await expect(ceoProfile.page).not.toHaveURL(
        `/ceo-directory/${ceo.id}/edit`
      )

      // check the ceo record
      let resp = await getCEO(apiContext, ceo.id)
      ceo = await resp.json()

      const expectedBusinessType =
        updateCEOInput.businessType || initialCEOData.businessType || undefined
      expect.soft(ceo.businessType?.displayName).toBe(expectedBusinessType)

      const expectedLocation =
        updateCEOInput.location || initialCEOData.location || undefined
      expect.soft(ceo.location).toBe(expectedLocation)

      const expectedMarketServiceArea = updateCEOInput.marketServiceArea || []
      expect
        .soft(ceo.marketServiceArea)
        .toStrictEqual(expectedMarketServiceArea)

      const expectedCustomerSegment =
        updateCEOInput.customerSegment || initialCEOData.customerSegment || []
      const actualCustomerSegment = ceo.customerSegment?.map(x => x.value)
      expect.soft(actualCustomerSegment).toStrictEqual(expectedCustomerSegment)

      const expectedBusinessFocusArea =
        updateCEOInput.businessFocusArea ||
        initialCEOData.businessFocusArea ||
        []
      const actualBusinessFocusArea = ceo.businessFocusArea?.map(x => x.value)
      expect
        .soft(actualBusinessFocusArea)
        .toStrictEqual(expectedBusinessFocusArea)

      const expectedBio = updateCEOInput.bio || initialCEOData.bio || undefined
      expect.soft(ceo.bio).toBe(expectedBio)

      const expectedAdditionalInfo =
        updateCEOInput.additionalInfo ||
        initialCEOData.additionalInfo ||
        undefined
      expect.soft(ceo.additionalInfo).toBe(expectedAdditionalInfo)

      const expectedVisible =
        updateCEOInput.visible || initialCEOData.visible || undefined
      expect.soft(ceo.visible?.value).toBe(expectedVisible)

      const expectedLinkedinHref =
        updateCEOInput.linkedinHref || initialCEOData.linkedinHref || undefined
      expect.soft(ceo.linkedinHref).toBe(expectedLinkedinHref)
    }
  )
})
