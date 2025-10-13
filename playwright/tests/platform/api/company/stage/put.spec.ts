import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany
} from '../../../../../utils/platform/company'

const UPDATE_TESTS = [
  { startingStage: 'THEME', udpateStage: 'THEME' },
  { startingStage: 'OP_CO', udpateStage: 'OP_CO' }
]
const ERR_TESTS = [
  { startingStage: 'THEME', udpateStage: 'CONCEPT' },
  { startingStage: 'THEME', udpateStage: 'NEW_CO' },
  { startingStage: 'THEME', udpateStage: 'OP_CO' },
  { startingStage: 'OP_CO', udpateStage: 'THEME' },
  { startingStage: 'OP_CO', udpateStage: 'CONCEPT' },
  { startingStage: 'OP_CO', udpateStage: 'NEW_CO' }
]

test.describe('PUT /company with "stage"', async () => {
  let company: CompanySummary
  let startingStage: string
  let updateStage: string

  test.beforeEach(async ({ request }, testInfo) => {
    const idx = parseInt(testInfo.title.substring(0, 2)) - 1
    if (idx < UPDATE_TESTS.length) {
      startingStage = UPDATE_TESTS[idx].startingStage
      updateStage = UPDATE_TESTS[idx].udpateStage
    } else {
      startingStage = ERR_TESTS[idx - UPDATE_TESTS.length].startingStage
      updateStage = ERR_TESTS[idx - UPDATE_TESTS.length].udpateStage
    }
    const name = `Test update stage from "${startingStage}" to "${updateStage}"`
    const postResp = await createCompany(request, {
      name: name,
      number: 1685656949 + idx,
      stage: startingStage
    })
    expect(postResp.status()).toBe(201)
    company = await postResp.json()
    expect(company.stage).toBe(startingStage)
  })

  test.afterEach(async ({ request }) => {
    const delResp = await deleteCompany(request, company.id)
    await expect(delResp.status()).toBe(204)
  })

  test.describe('Success Tests', async () => {
    for (const idx in UPDATE_TESTS) {
      test(`${parseInt(idx) + 1}. Update stage from ${
        UPDATE_TESTS[idx].startingStage
      } to ${UPDATE_TESTS[idx].udpateStage}`, async ({ request }) => {
        const putResp = await updateCompany(request, company.id, {
          name: company.name,
          stage: updateStage
        })
        expect.soft(putResp.status()).toBe(200)
        const json = await putResp.json()
        expect.soft(json.stage).toBe(updateStage)

        // get the company & check the stage
        const getResp = await getCompany(request, company.id)
        const getJson = await getResp.json()
        expect(getJson.stage).toBe(updateStage)
      })
    }
  })

  test.describe('Error Tests', async () => {
    const ERR_MSG = "stage can't be changed from its current value."
    const ERR_STATUS = 409
    const ERR_TYPE = 'Conflict'

    for (const idx in ERR_TESTS) {
      test(`${parseInt(idx) + UPDATE_TESTS.length + 1}. Update stage from ${
        ERR_TESTS[idx].startingStage
      } to ${ERR_TESTS[idx].udpateStage}`, async ({ request }) => {
        const putResp = await updateCompany(request, company.id, {
          name: company.name,
          stage: updateStage
        })
        expect.soft(putResp.status()).toBe(ERR_STATUS)
        const json = await putResp.json()
        expect.soft(json.error).toBe(ERR_TYPE)
        expect.soft(json.message).toBe(ERR_MSG)

        // get the company & check the stage
        const getResp = await getCompany(request, company.id)
        const getJson = await getResp.json()
        expect(getJson.stage).toBe(startingStage)
      })
    }
  })
})
