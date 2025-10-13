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
  filterCEOs as apiFilter,
  testCEOGenerator
} from '../../../../utils/platform/ceo'
import {
  deletePerson,
  testPersonGenerator
} from '../../../../utils/platform/person'
import { faker } from '@faker-js/faker'
import { impersonate, wait } from '../../../../utils/platform/utils'
import { ROLES } from '../../../../data/platform/users'
import {
  businessFocusAreas,
  businessType,
  customerSegments,
  healthcareSectors
} from '../../../../data/platform/ceos'

/**
 * Setup:
 *  - Create a Co user
 *  - Create an opco
 *  - Add user to opco
 *  - Create CEO profile for user with visible == 'OPT_IN'
 * Tests:
 * 1. Filter by Fundraise stage
 * 2. Filter by Healthcare sector
 * 3. Filter by Business focus area
 * 4. Filter by Customer segment
 * 5. Filter by Business type
 * Expect:
 * 1. All cards returned should match the filter
 * Teardown:
 * - delete CEO profile
 * - delete Co user
 * - delete opco
 */
portalTest.describe.configure({ mode: 'serial' })
portalTest.describe('Filter CEOs', () => {
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
      fundraiseStatus: faker.helpers.arrayElement(Object.keys(FundraiseStatus))
    })
    const resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)
    ceo = await testCEOGenerator(apiContext, {
      email: person.email,
      healthcareSector: faker.helpers.arrayElement(
        Object.keys(healthcareSectors)
      ),
      businessFocusArea: [
        faker.helpers.arrayElement(Object.keys(businessFocusAreas))
      ],
      customerSegment: [
        faker.helpers.arrayElement(Object.keys(customerSegments))
      ],
      businessType: faker.helpers.enumValue(businessType),
      visible: 'OPT_IN'
    })
    await wait(1000)
    await dashboard.goto()
    await impersonate(dashboard, person)
    await ceoDirectory.goto()
    await expect(ceoDirectory.firstCard).toBeVisible()
  })

  portalTest.afterEach(async ({}, testInfo) => {
    if (testInfo.errors?.length == 0) {
      await deleteCEO(apiContext, ceo.id)
      await deletePerson(apiContext, person.email)
      await deleteCompany(apiContext, opco.id)
      await apiContext.dispose()
    }
  })

  async function filterCEOs(ceoDirectory, field, value) {
    await ceoDirectory.filterCEOs(field, value)
    await wait(1000)
    await expect(ceoDirectory.firstCard).toBeVisible()
    const count = await ceoDirectory.resultsCount()
    expect.soft(count).toBeGreaterThanOrEqual(1)
    return count
  }

  portalTest('Filter by Fundraise stage', async ({ ceoDirectory }) => {
    let count = await filterCEOs(
      ceoDirectory,
      'Fundraise stage',
      opco.fundraiseStatus.displayName
    )
    count = count > 20 ? 20 : count
    await expect(
      ceoDirectory.allFundraiseStages.getByText(
        opco.fundraiseStatus.displayName
      )
    ).toHaveCount(count)
  })

  portalTest('Filter by Healthcare sector', async ({ ceoDirectory }) => {
    let count = await filterCEOs(
      ceoDirectory,
      'Healthcare sector',
      ceo.healthcareSector.displayName
    )
    count = count > 20 ? 20 : count
    await expect(
      ceoDirectory.allHealthcareSectors.getByText(
        ceo.healthcareSector.displayName
      )
    ).toHaveCount(count)
  })

  portalTest('Filter by Business focus area', async ({ ceoDirectory }) => {
    let count = await filterCEOs(
      ceoDirectory,
      'Business focus area',
      ceo.businessFocusArea[0].displayName
    )
    count = count > 20 ? 20 : count
    const regex = new RegExp(`${ceo.businessFocusArea[0].displayName}`)

    await expect(
      ceoDirectory.allBusinessFocusAreas.getByText(
        ceo.businessFocusArea[0].displayName
      )
    ).toHaveCount(count)
  })

  portalTest('Filter by Customer segment', async ({ ceoDirectory }) => {
    let count = await filterCEOs(
      ceoDirectory,
      'Customer segment',
      ceo.customerSegment[0].displayName
    )
    count = count > 20 ? 20 : count

    await expect(
      ceoDirectory.allCustomerSegments.getByText(
        ceo.customerSegment[0].displayName
      )
    ).toHaveCount(count)
  })

  portalTest('Filter by Business type', async ({ ceoDirectory }) => {
    const expectedBusinessType = ceo.businessType.displayName
    await filterCEOs(ceoDirectory, 'Business type', expectedBusinessType)

    // call the API directly and check the businessType of each entry
    const resp = await apiFilter(
      apiContext,
      `businessType,${expectedBusinessType}`
    )
    expect(resp.status()).toBe(200)
    const json = await resp.json()
    let expectedCEOs = []
    await json.content.forEach(ceo => {
      if (ceo.visible?.value == 'OPT_IN') {
        expectedCEOs.push(ceo.member.email)
      }
      expect.soft(ceo.businessType.displayName).toBe(expectedBusinessType)
    })
    expectedCEOs.sort()

    let actualCEOs = []
    const allCEOs = await await ceoDirectory.allCEOEmails.all()
    for (let i = 0; i < allCEOs.length; i++) {
      actualCEOs.push(await allCEOs[i].textContent())
    }
    await expect(expectedCEOs).toStrictEqual(actualCEOs)
  })
})
