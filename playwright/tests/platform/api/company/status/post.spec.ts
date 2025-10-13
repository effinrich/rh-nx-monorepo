import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany
} from '../../../../../utils/platform/company'

const VALID_STATUSES = [
  { testcase: 'ACTIVE', value: 'ACTIVE', expectedStatus: 'ACTIVE' },
  { testcase: 'PAUSED', value: 'PAUSED', expectedStatus: 'PAUSED' },
  { testcase: 'ARCHIVED', value: 'ARCHIVED', expectedStatus: 'ARCHIVED' }
]
// BUG:  https://redesignhealth.atlassian.net/browse/PUD-148
// 500 errors from POST /company when `status` is invalid
const INVALID_STATUSES = [
  //   { testcase: 'invalid string', value: 'bogus', expectedStatus: 'ACTIVE' },
  //   { testcase: 'array', value: [], expectedStatus: 'ACTIVE' },
  //   { testcase: 'object', value: {}, expectedStatus: 'ACTIVE' }
]
const TESTCASES = INVALID_STATUSES.concat(VALID_STATUSES)
test.describe('POST /company default status is "ACTIVE"', async () => {
  let company: CompanySummary

  test.afterEach(async ({ request }) => {
    const delResp = await deleteCompany(request, company.id)
    await expect(delResp.status()).toBe(204)
  })

  for (const idx in TESTCASES) {
    let tc = TESTCASES[idx].testcase
    let value = TESTCASES[idx].value
    let expStatus = TESTCASES[idx].expectedStatus
    test(`Status: ${tc}`, async ({ request }) => {
      const TIMESTAMP = Date.now() + idx
      const NAME = `Test Company default status`
      const postResp = await createCompany(request, {
        name: NAME,
        number: TIMESTAMP,
        description: `New Company with status: ${tc}`,
        legalName: `Test Company Legal Name`,
        status: value
      })
      expect(postResp.status()).toBe(201)
      company = await postResp.json()
      expect(company.status).toBe(expStatus)

      // GET /company and check status
      const getResp = await getCompany(request, company.id)
      const getJson = await getResp.json()
      expect(getJson.status).toBe(expStatus)
    })
  }
})

const STATUSES = ['ACTIVE', 'PAUSED', 'ARCHIVED']
test('All companies have a status', async ({ request }) => {
  const resp = await getCompanies(request)
  expect(resp.status()).toBe(200)
  const companies = await resp.json()

  companies.content.forEach(async co => {
    expect
      .soft(STATUSES, `Company "${co.name}" status is ${co.status}`)
      .toContain(co.status)
  })
})
