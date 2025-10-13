import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  getCompany
} from '../../../../../utils/platform/company'

const STAGES = [
  { input: 'THEME', expectedStage: 'THEME' },
  { input: 'OP_CO', expectedStage: 'OP_CO' },
  { input: null, expectedStage: 'OP_CO' },
  { input: undefined, expectedStage: 'OP_CO' }
]
const LINKED_STAGES = [
  { input: 'CONCEPT', expectedStage: 'CONCEPT' },
  { input: 'NEW_CO', expectedStage: 'NEW_CO' }
]
test.describe('POST /company with "stage"', async () => {
  let company: CompanySummary

  test.afterEach(async ({ request }) => {
    const delResp = await deleteCompany(request, company.id)
    await expect(delResp.status()).toBe(204)
  })

  for (const idx in STAGES) {
    let stage = STAGES[idx].input
    test(`Stage: ${stage}`, async ({ request }) => {
      const TIMESTAMP = Date.now() + idx
      const NAME = `Test Company with stage "${stage}"`
      const postResp = await createCompany(request, {
        name: NAME,
        number: TIMESTAMP,
        description: `New Company with stage: ${stage}`,
        legalName: `Test Company Legal Name ${stage}`,
        stage: stage
      })
      expect(postResp.status()).toBe(201)
      company = await postResp.json()
      expect(company.stage).toBe(STAGES[idx].expectedStage)

      // GET /company and check stage
      const getResp = await getCompany(request, company.id)
      const getJson = (await getResp.json()) as CompanySummary
      expect(getJson.stage).toBe(STAGES[idx].expectedStage)
    })
  }
})
