import { APIRequestContext, expect } from '@playwright/test'
import { portalTest } from '../../../../fixtures/platform-ui-test'
import {
  FundraiseStatus,
  addMemberToCompany,
  deleteCompany,
  newAPIContext,
  testCompanyGenerator
} from '../../../../utils/platform/company'
import {
  deleteCEO,
  getCEO,
  testCEOGenerator
} from '../../../../utils/platform/ceo'
import {
  deletePerson,
  testPersonGenerator
} from '../../../../utils/platform/person'
import { faker } from '@faker-js/faker'
import { impersonate } from '../../../../utils/platform/utils'
import { ROLES } from '../../../../data/platform/users'
import {
  businessFocusAreas,
  businessType,
  customerSegments,
  healthcareSectors,
  location,
  marketServiceAreas
} from '../../../../data/platform/ceos'

/**
 * Setup:
 *  - Create a Co user
 *  - Create an opco
 *  - Add user to opco
 *  - Create CEO profile for user with visible == 'OPT_OUT'
 * Tests:
 * 1. Welcome to the CEO directory page
 * Teardown:
 * - delete CEO profile
 * - delete Co user
 * - delete opco
 */
portalTest.describe.configure({ mode: 'serial' })
// note: change this to parallel once the 500 error is fixed
// https://redesignhealth.atlassian.net/browse/PUD-806
portalTest.describe('CEO onboarding', () => {
  let apiContext: APIRequestContext
  let ceo: CEOSummary
  let opco: CompanySummary
  let person: PersonSummary

  portalTest.beforeEach(async ({ ceoOnboarding }, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    person = await testPersonGenerator(apiContext, {
      role: ROLES.coUser.authority
    })
    opco = await testCompanyGenerator(apiContext, {
      fundraiseStatus: faker.helpers.arrayElement(Object.keys(FundraiseStatus))
    })
    const resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)
    ceo = await testCEOGenerator(apiContext, {
      email: person.email,
      visible: 'OPT_OUT'
    })
    await ceoOnboarding.goto()
    impersonate(ceoOnboarding, person)
  })

  portalTest.afterEach(async ({}, testInfo) => {
    if (testInfo.errors?.length == 0) {
      await deleteCEO(apiContext, ceo.id)
      await deletePerson(apiContext, person.email)
      await deleteCompany(apiContext, opco.id)
      await apiContext.dispose()
    }
  })

  portalTest('Opt-out flow @dev', async ({ ceoOnboarding, ceoDirectory }) => {
    await expect
      .soft(ceoOnboarding.welcomeScreen)
      .toHaveScreenshot('welcome.png')
    await ceoOnboarding.optOut.click()
    await expect
      .soft(ceoOnboarding.welcomeScreen)
      .toHaveScreenshot('opt-out-radio.png')
    await ceoOnboarding.continueBtn.click()
    await expect(ceoOnboarding.continueToDirectoryBtn).toBeVisible()
    await expect
      .soft(ceoOnboarding.welcomeScreen)
      .toHaveScreenshot('opt-out-page.png')
    await ceoOnboarding.continueToDirectoryBtn.click()
    await expect.soft(ceoOnboarding.optOutAlert).toHaveScreenshot('alert.png')

    // CEO directory has details blurred
    await ceoDirectory.goto()
    await expect(ceoDirectory.firstCard).toBeVisible()
    const allCEOCards = await ceoDirectory.allCEOCards()
    for (let i = 0; i < allCEOCards.length; i++) {
      expect.soft(await allCEOCards[i].isProfileRestricted()).toBeTruthy()
      expect.soft(await allCEOCards[i].isLastNameBlurred()).toBeTruthy()
      expect.soft(await allCEOCards[i].isEmailBlurred()).toBeTruthy()
      expect.soft(await allCEOCards[i].isLocationBlurred()).toBeTruthy()
      expect.soft(await allCEOCards[i].isCompanyNameBlurred()).toBeTruthy()
    }
  })

  portalTest('Opt-in flow', async ({ ceoDirectory, ceoOnboarding }) => {
    await ceoOnboarding.optIn.click()
    await expect
      .soft(ceoOnboarding.welcomeScreen)
      .toHaveScreenshot('opt-in-radio.png')
    await ceoOnboarding.continueBtn.click()
    // check name, company & email on Welcome form
    expect(await ceoOnboarding.optInForm.readHeader()).toStrictEqual({
      ceoName: `${person.givenName} ${person.familyName}`,
      ceoCompany: opco.name,
      ceoEmail: person.email
    })
    // opt-in should already be selected by default
    expect(await ceoOnboarding.optInForm.visible.control.selected()).toBe(
      'OPT_IN'
    )

    const input: CEOCommand = {
      location: faker.helpers.enumValue(location),
      bio: faker.lorem.paragraph(),
      additionalInfo: faker.lorem.paragraph(),
      linkedinHref: faker.internet.url(),
      businessType: faker.helpers.enumValue(businessType),
      customerSegment: faker.helpers.arrayElements(
        Object.keys(customerSegments),
        { min: 1, max: 5 }
      ),
      healthcareSector: faker.helpers.arrayElement(
        Object.keys(healthcareSectors)
      ),
      businessFocusArea: faker.helpers.arrayElements(
        Object.keys(businessFocusAreas),
        { min: 1, max: 5 }
      ),
      marketServiceArea: faker.helpers.arrayElements(marketServiceAreas, {
        min: 1,
        max: 5
      })
    }
    await ceoOnboarding.optInForm.fillout(input)
    await ceoOnboarding.optInForm.submit()
    // await expect(ceoOnboarding.optInConfirmation).toHaveScreenshot(
    //   'confirmation.png'
    // )
    await ceoOnboarding.takeMeToDirectoryBtn.click()
    await expect(ceoDirectory.pageHeading).toHaveText('CEO Directory')

    // check data persistence
    const resp = await getCEO(apiContext, ceo.id)
    expect.soft(resp.status()).toBe(200)
    const json = await resp.json()
    expect.soft(json.member.email).toBe(person.email)
    expect.soft(json.member.givenName).toBe(person.givenName)
    expect.soft(json.member.familyName).toBe(person.familyName)
    expect.soft(json.member.company.id).toBe(opco.id)
    expect.soft(json.businessType.displayName).toBe(input.businessType)
    expect.soft(json.location).toBe(input.location)
    expect.soft(json.marketServiceArea).toStrictEqual(input.marketServiceArea)
    expect
      .soft(json.customerSegment.map(x => x.value))
      .toStrictEqual(input.customerSegment)
    expect.soft(json.healthcareSector.value).toBe(input.healthcareSector)
    expect
      .soft(json.businessFocusArea.map(x => x.value))
      .toStrictEqual(input.businessFocusArea)
    expect.soft(json.bio).toBe(input.bio)
    expect.soft(json.additionalInfo).toBe(input.additionalInfo)
    expect.soft(json.visible.displayName).toBe('Opt in')
    expect.soft(json.linkedinHref).toBe(input.linkedinHref)
  })
})
