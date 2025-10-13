import { expect, test } from '@playwright/test'
import {
  testCompanyGenerator,
  FundraiseStatus,
  testCompanyData,
  deleteCompany,
  createCompany,
  updateCompany,
  getCompany
} from '../../../../utils/platform/company'
import { faker } from '@faker-js/faker'

test.describe('fundraiseStatus', () => {
  let coInput: CompanyCommand
  let opco: CompanySummary

  test.beforeEach(async () => {
    coInput = await testCompanyData()
  })

  test.afterEach(async ({ request }) => {
    await deleteCompany(request, opco.id)
  })

  test('Default value is "Pre launch phase"', async ({ request }) => {
    delete coInput['fundraiseStatus']
    const resp = await createCompany(request, coInput)
    expect(resp.status()).toBe(201)
    opco = await resp.json()
    expect(opco.fundraiseStatus.displayName).toBe(
      FundraiseStatus.PRE_LAUNCH_PHASE.displayName
    )
  })

  const testcases = [
    {
      start: FundraiseStatus.PRE_LAUNCH_PHASE,
      end: FundraiseStatus.PRE_SERIES_A
    },
    { start: FundraiseStatus.PRE_SERIES_A, end: FundraiseStatus.SERIES_A },
    { start: FundraiseStatus.SERIES_A, end: FundraiseStatus.SERIES_B },
    { start: FundraiseStatus.SERIES_B, end: FundraiseStatus.SERIES_C }
  ]
  for (const tc of testcases) {
    test(`${tc.start.displayName} update to ${tc.end.displayName}`, async ({
      request
    }) => {
      // create
      coInput['fundraiseStatus'] = tc.start.value
      opco = await testCompanyGenerator(request, coInput)
      expect(opco.fundraiseStatus.value).toBe(tc.start.value)

      // get
      let resp = await getCompany(request, opco.id)
      expect(resp.status()).toBe(200)
      let json = (await resp.json()) as CompanySummary
      expect(json.fundraiseStatus).toStrictEqual(tc.start)

      // update
      resp = await updateCompany(request, opco.id, {
        name: opco.name,
        fundraiseStatus: tc.end.value
      })
      expect(resp.status()).toBe(200)

      // get
      resp = await getCompany(request, opco.id)
      expect(resp.status()).toBe(200)
      json = (await resp.json()) as CompanySummary
      expect(json.fundraiseStatus).toStrictEqual(tc.end)
    })
  }
})

test.describe('Cannot POST non-opco with fundraiseStatus', () => {
  const stages = ['THEME', 'CONCEPT', 'NEW_CO']
  for (const stage of stages) {
    test(stage, async ({ request }) => {
      const input = testCompanyData({ stage: stage })
      input.fundraiseStatus = faker.helpers.arrayElement(
        Object.keys(FundraiseStatus)
      )
      const resp = await createCompany(request, input)
      const expectedError = {
        name: 'fundraiseStatus',
        rejectedValue: FundraiseStatus[input.fundraiseStatus].displayName,
        description: `Can only be assigned to OP_CO`
      }
      expect(resp.status()).toBe(422)
      expect((await resp.json()).errors[0]).toStrictEqual(expectedError)
    })
  }
})

test.describe(() => {
  let newCo: CompanySummary

  test.afterEach(async ({ request }) => {
    const conceptid = newCo.linkedApiId
    const resp = await getCompany(request, conceptid)
    const themeid = (await resp.json()).linkedApiId
    await deleteCompany(request, newCo.id)
    await deleteCompany(request, conceptid)
    await deleteCompany(request, themeid)
  })
  test('Can promote NewCo to OpCo with fundraiseStatus', async ({
    request
  }) => {
    newCo = await testCompanyGenerator(request, {
      name: 'Test: promote NewCo with fundraiseStatus',
      stage: 'NEW_CO'
    })
    const resp1 = await updateCompany(request, newCo.id, {
      name: 'Test: promote NewCo with fundraiseStatus',
      stage: 'OP_CO',
      fundraiseStatus: 'SERIES_A',
      linkedApiId: newCo.linkedApiId
    })
    expect(resp1.status()).toBe(200)
    const resp2 = await getCompany(request, newCo.id)
    expect(resp2.status()).toBe(200)
    const json = (await resp2.json()) as CompanySummary
    expect(json.stage).toBe('OP_CO')
    expect(json.fundraiseStatus.displayName).toBe('Series A')
  })
})
