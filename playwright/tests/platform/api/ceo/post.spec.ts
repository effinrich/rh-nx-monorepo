import { expect, test } from '@playwright/test'
import {
  createCEO,
  deleteCEO,
  testCEOData
} from '../../../../utils/platform/ceo'
import { createPerson, deletePerson } from '../../../../utils/platform/person'

test.describe('POST /ceo', async () => {
  let input: CEOCommand

  test.beforeEach(async () => {
    input = testCEOData()
  })

  test('Email is required', async ({ request }) => {
    delete input.email
    const resp = await createCEO(request, input)
    expect.soft(resp.status()).toBe(422)
    const json = await resp.json()
    expect(json.errors[0].description).toBe('Email is required')
  })

  test('Email must be in system', async ({ request }) => {
    const resp = await createCEO(request, input)
    expect.soft(resp.status()).toBe(422)
    const json = await resp.json()
    expect(json.errors[0].description).toBe('must exist')
  })

  test.describe(async () => {
    let ceo: CEOSummary
    let person: PersonSummary

    test.afterEach(async ({ request }) => {
      await deletePerson(request, person.email)
      await deleteCEO(request, ceo.id)
    })

    test('Email must be unique', async ({ request }) => {
      let resp = await createPerson(request, { email: input.email })
      person = await resp.json()
      await expect.soft(resp.status()).toBe(201)
      resp = await createCEO(request, input)
      ceo = await resp.json()
      expect.soft(resp.status()).toBe(201)
      resp = await createCEO(request, input)
      expect.soft(resp.status()).toBe(422)
      const json = await resp.json()
      expect(json.errors[0].description).toBe('must be unique')
    })
  })
})
