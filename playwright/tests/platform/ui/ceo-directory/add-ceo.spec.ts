import path from 'path'
import { APIRequestContext, expect } from '@playwright/test'
import {
  deleteCompany,
  testCompanyGenerator,
  newAPIContext,
  addMemberToCompany,
  FundraiseStatus
} from '../../../../utils/platform/company'
import { deletePerson, getPerson } from '../../../../utils/platform/person'
import { portalTest } from '../../../../fixtures/platform-ui-test'
import { testPersonGenerator } from '../../../../utils/platform/person'
import { deleteCEO, getCEO, testCEOData } from '../../../../utils/platform/ceo'
import { ROLES } from '../../../../data/platform/users'
import {
  businessFocusAreas,
  customerSegments,
  healthcareSectors
} from '../../../../data/platform/ceos'
import { faker } from '@faker-js/faker'

/**
 * Setup:
 *  - Create a Co User via the API
 *  - Create an opco via the API
 *  - Add the Co User to the OpCo
 * Test:
 *  1. Log in as Admin
 *  2. Open the Add CEO form
 *  3. Fill out & submit the form
 *  3. Check data persistence
 * Teardown:
 *  - Delete CEO Profile
 *  - Delete person
 *  - Delete opco
 */

portalTest.describe.configure({ mode: 'serial' })
portalTest.describe('Add CEO', () => {
  let apiContext: APIRequestContext
  let ceo: CEOSummary
  let opco: CompanySummary
  let person: PersonSummary
  let ceoInput: CEOCommand
  const avatarIdx = Math.floor(Math.random() * 21) + 1001
  let avatarFile: string = path.join(
    __dirname,
    '../../../../data/platform/avatars',
    `${avatarIdx}.png`
  )

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
    ceoInput = testCEOData({
      email: person.email,
      pictureHref: avatarFile,
      visible: faker.datatype.boolean() ? 'OPT_IN' : 'OPT_OUT'
    })
  })

  portalTest.afterAll(async () => {
    await deleteCEO(apiContext, ceo.id)
    await deletePerson(apiContext, person.email)
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  portalTest('Admin can add a CEO', async ({ signInAdmin, ceoDirectory }) => {
    let ceoId
    await ceoDirectory.addCEOForm.goto()
    await ceoDirectory.addCEOForm.addCEO(ceoInput)

    // get the ceo id from the /person response
    await expect(async () => {
      let resp = await getPerson(apiContext, person.email)
      let json = await resp.json()
      expect(json.ceoInfo.ceo).toBeTruthy()
      ceoId = await json.ceoInfo.id
    }).toPass({ intervals: [500], timeout: 3_000 })

    // check the ceo record
    let resp = await getCEO(apiContext, ceoId)
    ceo = await resp.json()

    const expectedCEO = {
      member: {
        email: person.email,
        givenName: person.givenName,
        familyName: person.familyName,
        company: {
          id: opco.id,
          name: opco.name,
          stage: 'OP_CO',
          description: opco.description,
          href: opco.href,
          fundraiseStatus: {
            displayName: opco.fundraiseStatus.displayName,
            value: opco.fundraiseStatus.value
          }
        }
      },
      marketServiceArea: ceoInput.marketServiceArea || [],
      customerSegment: ceoInput.customerSegment
        ? ceoInput.customerSegment.map(x => {
            return { displayName: customerSegments[x], value: x }
          })
        : [],
      businessFocusArea: ceoInput.businessFocusArea
        ? ceoInput.businessFocusArea.map(x => {
            return { displayName: businessFocusAreas[x], value: x }
          })
        : [],
      visible:
        ceoInput.visible == 'OPT_IN'
          ? { displayName: 'Opt in', value: 'OPT_IN' }
          : { displayName: 'Opt out', value: 'OPT_OUT' },
      id: ceoId,
      links: []
    }
    if (ceoInput.healthcareSector) {
      expectedCEO['healthcareSector'] = {
        value: ceoInput.healthcareSector,
        displayName: healthcareSectors[ceoInput.healthcareSector]
      }
    }
    if (ceoInput.businessType) {
      expectedCEO['businessType'] = {
        displayName: ceoInput.businessType,
        value: ceoInput.businessType
      }
    }
    if (ceoInput.linkedinHref) {
      expectedCEO['linkedinHref'] = ceoInput.linkedinHref
    }
    if (ceoInput.location) {
      expectedCEO['location'] = ceoInput.location
    }
    if (
      opco.fundraiseStatus.displayName ==
      FundraiseStatus.PRE_LAUNCH_PHASE.displayName
    ) {
      expectedCEO.member.company.name = 'StealthCo'
    }
    if (ceoInput.additionalInfo) {
      expectedCEO['additionalInfo'] = ceoInput.additionalInfo
    }
    expect.soft(ceo).toMatchObject(expectedCEO)
    if (ceoInput.pictureHref) {
      expect.soft(ceoInput.pictureHref.length).toBeGreaterThan(0)
    }
  })

  portalTest(
    'Email must not already be a CEO',
    async ({ signInAdmin, ceoDirectory }) => {
      await ceoDirectory.addCEOForm.goto()
      await expect(
        await ceoDirectory.addCEOForm.selectUser.control.option(person.email)
      ).toBeDisabled()
    }
  )
})
