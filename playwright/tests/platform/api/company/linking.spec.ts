import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany
} from '../../../../utils/platform/company'

const RULE =
  'Violation of the rule: CONCEPT Linked to THEME or NEW_CO Linked to CONCEPT'
test.describe('Theme > Concept > NewCo', async () => {
  test.describe.configure({ mode: 'serial' })

  let theme: CompanySummary
  let concept1: CompanySummary
  let concept2: CompanySummary
  let newCo: CompanySummary

  test.beforeAll(async ({ request }) => {
    // create a Theme
    const TIMESTAMP = Date.now() + 5
    const NAME = `Test: new Theme`
    const postResp = await createCompany(request, {
      name: NAME,
      number: TIMESTAMP,
      stage: 'THEME'
    })
    expect(postResp.status()).toBe(201)
    theme = await postResp.json()
    expect(theme.stage).toBe('THEME')
  })

  test.afterAll(async ({ request }, testInfo) => {
    // delete any leftover entities if there were errors
    if (testInfo.error) {
      try {
        await deleteCompany(request, newCo.id)
      } catch (err) {
        await console.log('could not delete the newco:', err)
      }
      try {
        await deleteCompany(request, concept1.id)
      } catch (err) {
        await console.log('could not delete the concept:', err)
      }
      try {
        await deleteCompany(request, concept2.id)
      } catch (err) {
        await console.log('could not delete the concept:', err)
      }
      try {
        await deleteCompany(request, theme.id)
      } catch (err) {
        await console.log('could not delete the theme:', err)
      }
    }
  })

  test('Cannot create a Theme with a linkedApiId', async ({ request }) => {
    const postResp = await createCompany(request, {
      name: `Test: Theme cannot have a linkedApiId`,
      number: 1686779468,
      stage: 'THEME',
      linkedApiId: theme.id
    })
    expect(postResp.status()).toBe(400)
    const err = await postResp.json()
    expect.soft(err.error).toBe('Bad Request')
    expect.soft(err.message).toBe("THEME can't have linked company")
  })

  test('Can create a Concept without a Theme', async ({ request }) => {
    const name = 'Test: Concept1 - no Theme'
    const stage = 'CONCEPT'
    const number = Date.now()
    const resp = await createCompany(request, {
      name: name,
      stage: stage,
      number: number
    })
    expect(resp.status()).toBe(201)
    concept1 = await resp.json()
    expect.soft(concept1.name).toBe(name)
    expect.soft(concept1.stage).toBe(stage)
    expect.soft(concept1.number).toBe(number)
    expect.soft(concept1.status).toBe('ACTIVE')
  })

  test('Can create Concept linked to a Theme', async ({ request }) => {
    const name = 'Test: Concept2 - with Theme'
    const stage = 'CONCEPT'
    const resp = await createCompany(request, {
      name: name,
      stage: stage,
      linkedApiId: theme.id
    })
    expect(resp.status()).toBe(201)
    const json = await resp.json()

    // check the concept
    const resp2 = await getCompany(request, json.id)
    expect(resp2.status()).toBe(200)
    concept2 = await resp2.json()
    expect.soft(concept2.name).toBe(name)
    expect.soft(concept2.stage).toBe(stage)
    expect(concept2.linkedApiId).toBe(theme.id)
  })

  test('Cannot create NewCo without a Concept', async ({ request }) => {
    const resp = await createCompany(request, {
      name: 'Test: NewCo without Concept',
      stage: 'NEW_CO'
    })
    expect(resp.status()).toBe(400)
    const json = await resp.json()
    expect.soft(json.error).toBe('Bad Request')
    expect(json.message).toBe('NEW_CO must be linked to a CONCEPT')
  })

  test('Can create NewCo linked to a Concept', async ({ request }) => {
    const resp = await createCompany(request, {
      name: 'Test: NewCo with Concept',
      stage: 'NEW_CO',
      linkedApiId: concept1.id
    })
    expect(resp.status()).toBe(201)
    const json = await resp.json()

    // check the newCo
    const resp2 = await getCompany(request, json.id)
    expect(resp2.status()).toBe(200)
    newCo = (await resp2.json()) as CompanySummary
    expect(newCo.stage).toBe('NEW_CO')
    expect(newCo.linkedApiId).toBe(concept1.id)
  })

  test('Can update a NewCo', async ({ request }) => {
    const input = {
      name: newCo.name + ' updated',
      number: newCo.number,
      legalName: 'NewCo legal name',
      description: 'NewCo description',
      stage: 'NEW_CO',
      status: 'ACTIVE',
      linkedApiId: concept2.id
    }
    const resp = await updateCompany(request, newCo.id, input)
    expect(resp.status()).toBe(200)
    // get updated newco
    const resp2 = await getCompany(request, newCo.id)
    newCo = (await resp2.json()) as CompanySummary
    expect.soft(newCo.name).toBe(input.name)
    expect.soft(newCo.legalName).toBe(input.legalName)
    expect.soft(newCo.description).toBe(input.description)
    expect.soft(newCo.stage).toBe(input.stage)
    expect.soft(newCo.status).toBe(input.status)
    expect.soft(newCo.linkedApiId).toBe(concept2.id)
  })

  test('Can update a Concept and add a Theme', async ({ request }) => {
    const input = {
      name: concept1.name + ' updated',
      number: concept1.number,
      legalName: 'legal name',
      description: 'description',
      stage: 'CONCEPT',
      status: 'ACTIVE',
      linkedApiId: theme.id
    }
    const resp = await updateCompany(request, concept1.id, input)
    expect(resp.status()).toBe(200)
    concept1 = await resp.json()
    expect.soft(concept1.name).toBe(input.name)
    expect.soft(concept1.number).toBe(input.number)
    expect.soft(concept1.legalName).toBe(input.legalName)
    expect.soft(concept1.description).toBe(input.description)
    expect.soft(concept1.stage).toBe(input.stage)
    expect.soft(concept1.status).toBe(input.status)
    expect.soft(concept1.linkedApiId).toBe(theme.id)
  })

  test('Cannot delete Theme that is linked', async ({ request }) => {
    const resp = await deleteCompany(request, theme.id)
    expect(resp.status()).toBe(403)
    const resp2 = await getCompany(request, theme.id)
    expect(resp2.status()).toBe(200)
  })

  test('Can delete Concept that is linked', async ({ request }) => {
    const resp = await deleteCompany(request, concept1.id)
    expect(resp.status()).toBe(204)
    const resp2 = await getCompany(request, concept1.id)
    expect(resp2.status()).toBe(404)
  })

  test('Can promote NewCo to OpCo', async ({ request }) => {
    const input = {
      name: 'Promoted from NewCo',
      number: newCo.number,
      stage: 'OP_CO',
      linkedApiId: newCo.linkedApiId
    }
    const resp = await updateCompany(request, newCo.id, input)
    expect(resp.status()).toBe(200)
    const resp2 = await getCompany(request, newCo.id)
    newCo = (await resp2.json()) as CompanySummary
    expect.soft(newCo.name).toBe(input.name)
    expect.soft(newCo.number).toBe(input.number)
    expect.soft(newCo.stage).toBe(input.stage)
    expect.soft(newCo.linkedApiId).toBe(concept2.id)
  })

  test('Cannot change linkedApiId after promoting NewCo to OpCo', async ({
    request
  }) => {
    const resp = await updateCompany(request, newCo.id, {
      name: newCo.name,
      linkedApiId: concept1.id
    })
    expect(resp.status()).toBe(400)
    const err = await resp.json()
    expect.soft(err.error).toBe('Bad Request')
    expect
      .soft(err.message)
      .toBe("Can't change linkedApiId after being promoted to OP_CO")
  })

  test('Can edit NewCo after promoting to OpCo', async ({ request }) => {
    const resp = await updateCompany(request, newCo.id, {
      name: 'Test: NewCo > OpCo (updated)',
      linkedApiId: newCo.linkedApiId
    })
    expect.soft(resp.status()).toBe(200)
    newCo = await resp.json()
  })

  test('Cannot create an OpCo with a linkedApiId', async ({ request }) => {
    const resp = await createCompany(request, {
      name: 'Test: New OpCo with linkedApiId',
      linkedApiId: concept1.id
    })
    expect(resp.status()).toBe(400)
    const json = await resp.json()
    expect(json.message).toBe(
      "OP_CO can't have a linked company upon creation."
    )
  })

  test('Can delete promoted OpCo', async ({ request }) => {
    const resp = await deleteCompany(request, newCo.id)
    expect(resp.status()).toBe(204)
    const resp2 = await getCompany(request, newCo.id)
    expect(resp2.status()).toBe(404)
  })

  test('Can delete Concept after deleting linked OpCo', async ({ request }) => {
    const resp = await deleteCompany(request, concept2.id)
    expect(resp.status()).toBe(204)
    const resp2 = await getCompany(request, concept2.id)
    expect(resp2.status()).toBe(404)
  })

  test('Can delete Theme after deleting linked Concept', async ({
    request
  }) => {
    const resp = await deleteCompany(request, theme.id)
    expect(resp.status()).toBe(204)
    const resp2 = await getCompany(request, theme.id)
    expect(resp2.status()).toBe(404)
  })
})
