import { expect, test } from '@playwright/test'
import {
  createCompany,
  createNewCo,
  deleteCompany,
  getConflictIds,
  updateCompany
} from '../../../../../utils/platform/company'
import { wait } from '../../../../../utils/platform/utils'

/**
 * Setup 3 Companies:
 *   1 - NewCo1
 *   2 - OpCo1
 *   3 - OpCo2 promoted from NewCo2
 * Five total upsert scenarios defined in ticket:
 * https://redesignhealth.atlassian.net/browse/PUD-143?focusedCommentId=28710
 */
test.describe.configure({ mode: 'serial' })
test.describe('Upsert Conflicts', async () => {
  let theme1: CompanySummary
  let concept1: CompanySummary
  let newCo1: CompanySummary
  let theme2: CompanySummary
  let concept2: CompanySummary
  let opCo1: CompanySummary
  let opCo2: CompanySummary

  const newCo1Input = {
    name: 'Test: 1688055870',
    stage: 'NEW_CO',
    number: 1688055870
  }
  const newCo2Input = {
    name: 'Test: 1688055873',
    stage: 'NEW_CO',
    number: 1688055873
  }
  const opCo1Input = {
    name: 'Test: 1688055875',
    stage: 'OP_CO',
    number: 1688055875
  }
  test.beforeAll(async ({ request }) => {
    // set up entities
    const resp1 = await createNewCo(request, newCo1Input)
    theme1 = resp1.theme
    concept1 = resp1.concept
    newCo1 = resp1.newCo
    const resp2 = await createNewCo(request, newCo2Input)
    theme2 = resp2.theme
    concept2 = resp2.concept
    const newCoB = resp2.newCo
    // promote newCo2 to OpCo
    const resp3 = await updateCompany(request, newCoB.id, {
      name: 'Test: OpCo promoted from NewCo',
      stage: 'OP_CO',
      linkedApiId: newCoB.linkedApiId
    })
    expect(resp3.status()).toBe(200)
    opCo2 = (await resp3.json()) as CompanySummary

    const resp4 = await createCompany(request, opCo1Input)
    expect(resp4.status()).toBe(201)
    opCo1 = await resp4.json()
  })

  test.afterEach(async ({ request }) => {
    // remove all conflicts
    const resp = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: []
      }
    })
    expect(resp.status()).toBe(200)
    wait(3000)
    let conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([])
  })

  test.afterAll(async ({ request }) => {
    let resp = await deleteCompany(request, opCo1.id)
    expect.soft(resp.status()).toBe(204)
    resp = await deleteCompany(request, opCo2.id)
    expect.soft(resp.status()).toBe(204)
    resp = await deleteCompany(request, concept2.id)
    expect.soft(resp.status()).toBe(204)
    resp = await deleteCompany(request, theme2.id)
    expect.soft(resp.status()).toBe(204)
    resp = await deleteCompany(request, newCo1.id)
    expect.soft(resp.status()).toBe(204)
    resp = await deleteCompany(request, concept1.id)
    expect.soft(resp.status()).toBe(204)
    resp = await deleteCompany(request, theme1.id)
    expect.soft(resp.status()).toBe(204)
  })

  test('1. Add 2 conflicts, Remove 1', async ({ request }) => {
    // add 2 conflicts
    const resp1 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: [newCo1.id, opCo2.id]
      }
    })
    expect(resp1.status()).toBe(200)
    let conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([newCo1.id, opCo2.id].sort())

    // remove 1 conflict
    const resp2 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: [newCo1.id]
      }
    })
    expect(resp2.status()).toBe(200)
    conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([newCo1.id])
  })

  test('2. Add a duplicate', async ({ request }) => {
    // add duplicate conflict
    const resp1 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: [newCo1.id, newCo1.id]
      }
    })
    expect(resp1.status()).toBe(200)
    let conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([newCo1.id])
  })

  test('3. Add a duplicate and a single', async ({ request }) => {
    // add duplicate and a single
    const resp1 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: [newCo1.id, newCo1.id, opCo2.id]
      }
    })
    expect(resp1.status()).toBe(200)
    let conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([newCo1.id, opCo2.id].sort())
  })

  test('4. Add an unknown id among known ids', async ({ request }) => {
    // add an unknown coId among known coIds
    const resp1 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: [newCo1.id, 'bogus', opCo2.id]
      }
    })
    expect(resp1.status()).toBe(200)
    let conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([newCo1.id, opCo2.id].sort())
  })

  test('5. Overwrite existing conflicts with unknown id', async ({
    request
  }) => {
    // attempt to overwrite existing known conflict ids with an unknown id
    const resp1 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: [newCo1.id, opCo2.id]
      }
    })
    expect(resp1.status()).toBe(200)
    let conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([newCo1.id, opCo2.id].sort())

    // update
    const resp2 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: ['bogus']
      }
    })
    expect(resp2.status()).toBe(200)
    conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([newCo1.id, opCo2.id].sort())
  })

  test('6. Remove all conflicts', async ({ request }) => {
    // set 2 conflicts
    const resp1 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: [newCo1.id, opCo2.id]
      }
    })
    expect(resp1.status()).toBe(200)
    let conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([newCo1.id, opCo2.id].sort())

    // remove all
    const resp2 = await request.put(`/company/${opCo1.id}/conflicts`, {
      data: {
        conflicts: []
      }
    })
    expect(resp2.status()).toBe(200)
    conflicts = await getConflictIds(request, opCo1.id)
    expect(conflicts).toEqual([])
  })
})
