import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany
} from '../../../../utils/platform/company'
import { createPerson, deletePerson } from '../../../../utils/platform/person'
import {
  createResearch,
  deleteResearch,
  getResearch,
  queryResearch,
  requiredFieldError,
  filterResearch
} from '../../../../utils/platform/research'
import { fakeResearchData } from '../../../../data/platform/research'
import { wait } from '../../../../utils/platform/utils'

/**
 * 1. New entity appears in search result
 * 2. Required fields
 */
test.describe.configure({ mode: 'serial' })
test.describe('POST /research', () => {
  let opCo: CompanySummary
  let person: PersonSummary
  let researchDoc: ResearchSummary
  let opCo2: CompanySummary
  let researchDoc2: ResearchSummary
  let timestamp1: string
  const id = Date.now()

  test.beforeAll(async ({ request }) => {
    // create new user
    const resp1 = await createPerson(request, {
      email: `test-research_${id}@email.test`,
      familyName: `Test-research${id}`,
      givenName: `Test-research${id}`
    })
    expect(resp1.status()).toBe(201)
    person = await resp1.json()

    // create company
    const resp2 = await createCompany(request, {
      name: `Test: post research ${id}`,
      number: id
    })
    expect(resp2.status()).toBe(201)
    opCo = (await resp2.json()) as CompanySummary
  })

  test.describe('POST & GET', () => {
    test.afterAll(async ({ request }) => {
      await deleteResearch(request, researchDoc.id)
      await deleteCompany(request, opCo.id)
      await deleteResearch(request, researchDoc2.id)
      await deleteCompany(request, opCo2.id)
      await deletePerson(request, person.email)
    })

    async function verifyResearchSummary(
      actual: ResearchSummary,
      expected: ResearchCommand,
      opCoNew: CompanySummary = null
    ) {
      const fields = [
        'authors',
        'methods',
        'objectives',
        'segments',
        'services',
        'supportingFiles',
        'title'
      ]
      if (opCoNew === null) opCoNew = opCo
      for (const field of fields) {
        expect.soft(actual[field]).toEqual(expected[field])
      }
      expect.soft(actual.company.id).toEqual(expected.companyId)
      expect.soft(actual.entity).toBe(opCoNew.name)
      expect.soft(actual.links).toEqual([])
    }

    test('New research doc appears in search results', async ({ request }) => {
      // add research item
      timestamp1 = (Date.now() + 177886).toString()
      const input = fakeResearchData(timestamp1, opCo.id)
      input.authors = [person.email]
      const resp1 = await createResearch(request, input)
      expect(resp1.status()).toBe(201)
      researchDoc = (await resp1.json()) as ResearchSummary
      await verifyResearchSummary(researchDoc, input)

      // get /research & check for item
      await wait(1000)
      const resp2 = await getResearch(request)
      expect(resp2.status()).toBe(200)
      const json2 = await resp2.json()
      const entry = json2.content.filter(r => r.title === input.title)
      expect(entry.length).toEqual(1)
      await verifyResearchSummary(entry[0], input)

      // search for item using query param
      const resp3 = await queryResearch(request, { q: `title,${timestamp1}` })
      expect(resp3.status()).toBe(200)
      const json3 = await resp3.json()
      expect(json3.content.length).toBe(1)
      expect(json3.content[0].title.includes(timestamp1))
    })
    test('Get documents using filter with various values', async ({
      request
    }) => {
      const id2 = Date.now() + 1693408360
      // create company2
      const resp2 = await createCompany(request, {
        name: `Test: post research ${id2}`,
        number: id2,
        createGFolder: false
      })
      expect(resp2.status()).toBe(201)
      opCo2 = (await resp2.json()) as CompanySummary
      // add another research item
      const timestamp2 = (Date.now() + 177886).toString()
      const input2 = fakeResearchData(timestamp2, opCo2.id)
      input2.authors = [person.email]
      const respNew = await createResearch(request, input2)
      expect(respNew.status()).toBe(201)
      researchDoc2 = (await respNew.json()) as ResearchSummary
      await verifyResearchSummary(researchDoc2, input2, opCo2)
      await wait(1000)
      const prefixText = 'Test: Research '
      const values = [prefixText + timestamp1, prefixText + timestamp2]
      let myMap = new Map<string, string[]>([['title', [values[0], values[1]]]])
      const respFromFilter = await filterResearch(request, myMap)
      expect(respFromFilter.status()).toBe(200)
      const json2 = await respFromFilter.json()
      expect(json2.content.length === 2)
      let matches: number = 0
      json2.content.forEach(document => {
        if (values.find(elem => elem === document.title)) ++matches
      })
      expect(matches === 2)
    })
  })

  test.describe('Required fields', async () => {
    const REQUIRED = [
      'objectives',
      'companyId',
      'authors',
      'title',
      'methods',
      'services',
      'segments'
    ]
    for (const idx in REQUIRED) {
      test(`${REQUIRED[idx]} not in payload`, async ({ request }) => {
        const field = REQUIRED[idx]
        const input = fakeResearchData(Date.now() + idx + 1, opCo.id)
        // remove the field being tested from the input
        delete input[field]
        const resp1 = await createResearch(request, input)
        expect(resp1.status()).toBe(422)
        const json = await resp1.json()
        expect(json).toEqual(expect.objectContaining(requiredFieldError(field)))
      })
    }
    for (const idx in REQUIRED) {
      test(`${REQUIRED[idx]} in playload but null`, async ({ request }) => {
        const field = REQUIRED[idx]
        const input = fakeResearchData(Date.now() + idx + 10, opCo.id)
        // remove the field being tested from the input
        input[field] = null
        const resp1 = await createResearch(request, input)
        expect(resp1.status()).toBe(422)
        const json = await resp1.json()
        expect(json).toEqual(expect.objectContaining(requiredFieldError(field)))
      })
    }
  })
})
