import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany
} from '../../../../utils/platform/company'
import { createPerson, deletePerson } from '../../../../utils/platform/person'
import {
  createResearch,
  deleteResearch,
  queryResearch
} from '../../../../utils/platform/research'

/**
 * Setup:
 *  - create new user
 *  - create new company
 *  - create new research item with known data in supportingFiles
 * Test:
 *  - Call GET /research?q and search by known text from each document
 * Expect:
 *  - the research document shall appear in the search result
 *    and shall be the only item in the search result
 */
test.describe.configure({ mode: 'serial' })
test.describe('Search Supporting Files', () => {
  test.skip(process.env.BASE_URL.includes('localhost'))
  let opCo: CompanySummary
  let person: PersonSummary
  let researchDoc: ResearchSummary
  const id = Date.now() + 1693420255

  let input = {
    title: `Test: Research supportingDocs ${id}`,
    authors: [''],
    objectives: 'Test the search functionality on supporting documents',
    services: ['Search supporting docs'],
    methods: ['OpenSearch'],
    segments: ['backend', 'frontend'],
    supportingFiles: [
      {
        href: 'https://docs.google.com/document/d/1qYCo0YywBatugmlsjdFtBbeJICuQlVsmN8cGi5IuTJA',
        name: 'report_url'
      },
      {
        href: 'https://docs.google.com/presentation/d/1AiNWNLqAZ8joN_dYzxd0UuOHoJX008RPSYmFVsI4dnY',
        name: 'report_url'
      }
    ],
    companyId: ''
  }

  test.beforeAll(async ({ request }) => {
    // create new user
    const resp1 = await createPerson(request, {
      email: `test-research_${id}@email.test`,
      familyName: `Test-research${id}`,
      givenName: `Test-research${id}`
    })
    expect(resp1.status()).toBe(201)
    person = await resp1.json()
    input.authors = [person.email]

    // create company
    const resp2 = await createCompany(request, {
      name: `Test: post research ${id}`,
      number: id
    })
    expect(resp2.status()).toBe(201)
    opCo = (await resp2.json()) as CompanySummary
    input.companyId = opCo.id

    // add research item
    const resp3 = await createResearch(request, input)
    expect(resp3.status()).toBe(201)
    researchDoc = (await resp3.json()) as ResearchSummary
  })

  test.afterAll(async ({ request }) => {
    await deleteResearch(request, researchDoc.id)
    await deleteCompany(request, opCo.id)
    await deletePerson(request, person.email)
  })

  const TESTS = [
    { docType: 'Document', searchTerm: 'Bowie' },
    { docType: 'Slide', searchTerm: 'Muertos' }
  ]

  for (const t of TESTS) {
    test(t.docType, async ({ request }) => {
      await expect(async () => {
        const resp = await queryResearch(request, { q: t.searchTerm })
        expect(resp.status()).toBe(200)
        const json = await resp.json()
        expect(json.content.length).toBe(1)
        expect(json.content[0].title).toEqual(input.title)
      }).toPass()
    })
  }
})
