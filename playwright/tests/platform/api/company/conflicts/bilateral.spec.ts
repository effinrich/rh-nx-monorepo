import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  getConflictIds
} from '../../../../../utils/platform/company'

/**
 *  https://redesignhealth.atlassian.net/browse/PUD-144
 *  1. CompanyA has a conflict with companyB,
 *      confirm that companyB has conflict on both sides
 *  2. CompanyC has conflict with companyA
 *      confirm that companyA has conflicts with B & C.
 */
test.describe.configure({ mode: 'serial' })
test.describe('Bilateral Conflicts', async () => {
  const coNames = ['companyA', 'companyB', 'companyC']
  let companies = {}

  test.beforeAll(async ({ request }) => {
    // set up companies
    let i = 1
    for (const co of coNames) {
      const input = {
        name: `Test: Bilateral conflicts ${co}`,
        number: 1688086363 + i
      }
      const resp = await createCompany(request, input)
      expect(resp.status()).toBe(201)
      companies[co] = await resp.json()
      i = i + 2
    }
  })

  test.afterAll(async ({ request }) => {
    for (const co of coNames) {
      const id = companies[co].id
      let resp = await deleteCompany(request, id)
      expect.soft(resp.status()).toBe(204)
    }
  })

  test('1. CompanyA conflicts with CompanyB', async ({ request }) => {
    const idA = companies['companyA'].id
    const idB = companies['companyB'].id
    const resp1 = await request.put(`/company/${idA}/conflicts`, {
      data: {
        conflicts: [idB]
      }
    })
    expect(resp1.status()).toBe(200)

    // check companyA's conflicts
    let conflictsA = await getConflictIds(request, idA)
    expect(conflictsA).toEqual([idB])

    // check companyB's conflicts
    let conflictsB = await getConflictIds(request, idB)
    expect(conflictsB).toEqual([idA])
  })

  test('2. CompanyC conflicts with CompanyA', async ({ request }) => {
    const idC = companies['companyC'].id
    const idA = companies['companyA'].id
    const idB = companies['companyB'].id
    const resp1 = await request.put(`/company/${idC}/conflicts`, {
      data: {
        conflicts: [idA]
      }
    })
    expect(resp1.status()).toBe(200)

    // check companyC's conflicts
    let conflictsC = await getConflictIds(request, idC)
    expect(conflictsC).toEqual([idA])

    // check companyA's conflicts
    let conflictsA = await getConflictIds(request, idA)
    expect(conflictsA).toEqual([idB, idC].sort())
  })
})
