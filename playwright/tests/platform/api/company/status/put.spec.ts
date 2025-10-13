import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  updateCompany
} from '../../../../../utils/platform/company'

const STAGES = ['THEME', 'OP_CO']
const TESTCASES = [
  { startingStatus: 'ACTIVE', updateStatus: 'ACTIVE' },
  { startingStatus: 'ACTIVE', updateStatus: 'PAUSED' },
  { startingStatus: 'ACTIVE', updateStatus: 'ARCHIVED' },
  { startingStatus: 'PAUSED', updateStatus: 'ACTIVE' },
  { startingStatus: 'PAUSED', updateStatus: 'PAUSED' },
  { startingStatus: 'PAUSED', updateStatus: 'ARCHIVED' },
  { startingStatus: 'ARCHIVED', updateStatus: 'ACTIVE' },
  { startingStatus: 'ARCHIVED', updateStatus: 'PAUSED' },
  { startingStatus: 'ARCHIVED', updateStatus: 'ARCHIVED' }
]

for (const stage of STAGES) {
  test.describe(`PUT /company status for ${stage}`, async () => {
    let company: CompanySummary
    let startingStatus
    let updateStatus
    test.beforeEach(async ({ request }, testInfo) => {
      const stageIdx = STAGES.indexOf(stage) + 11
      const tcIdx = parseInt(testInfo.title.substring(0, 1)) - 1
      startingStatus = TESTCASES[tcIdx].startingStatus
      updateStatus = TESTCASES[tcIdx].updateStatus
      const number = 1685994553 + tcIdx * stageIdx
      const postResp = await createCompany(request, {
        name: `Test: update company status from ${startingStatus} to ${updateStatus}`,
        number: number,
        stage: stage,
        status: startingStatus
      })
      expect(postResp.status()).toBe(201)
      company = await postResp.json()
      expect(company.status).toBe(startingStatus)
    })

    test.afterEach(async ({ request }) => {
      const delResp = await deleteCompany(request, company.id)
      await expect(delResp.status()).toBe(204)
    })

    for (const idx in TESTCASES) {
      test(`${parseInt(idx) + 1}. update status: ${
        TESTCASES[idx].startingStatus
      } > ${TESTCASES[idx].updateStatus}`, async ({ request }) => {
        const updateStatus = TESTCASES[idx].updateStatus
        const putResp = await updateCompany(request, company.id, {
          name: company.name,
          status: updateStatus
        })
        expect.soft(putResp.status()).toBe(200)
        const putJson = await putResp.json()
        expect(putJson.status).toBe(updateStatus)
      })
    }
  })
}
