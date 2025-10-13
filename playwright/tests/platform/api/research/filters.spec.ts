import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { companyTaxonomy } from '../../../../data/platform/company-taxonomy'
import {
  createCompany,
  deleteCompany
} from '../../../../utils/platform/company'
import { createPerson, deletePerson } from '../../../../utils/platform/person'
import {
  createResearch,
  deleteResearch,
  filterResearch
} from '../../../../utils/platform/research'
import { fakeResearchData } from '../../../../data/platform/research'
import { wait } from '../../../../utils/platform/utils'

/**
 * Setup:
 *  - create a new company, person, and research item (with unique values)
 * Test:
 *  - for each filterable field, check that the values from the research item
 *    appear as a filter option in the response from /research/filters
 *  - apply the filter and verify that the research item appears in the result
 */
test.describe.configure({ mode: 'serial' })
test.describe('POST /research', () => {
  let opCo: CompanySummary
  let person: PersonSummary
  let researchInput: ResearchCommand
  let researchDoc: ResearchSummary
  let filters

  // set these up now so the values are available for the data-driven tests
  const tax1Key = faker.helpers.objectKey(companyTaxonomy)
  const tax1Val = companyTaxonomy[tax1Key].name
  const tax2Key = faker.helpers.objectKey(companyTaxonomy[tax1Key].children)
  const tax2Val = companyTaxonomy[tax1Key].children[tax2Key]['name']
  const tax3Key = faker.helpers.objectKey(
    companyTaxonomy[tax1Key]['children'][tax2Key]['children']
  )
  const tax3Val =
    companyTaxonomy[tax1Key].children[tax2Key]['children'][tax3Key]
  const id = Date.now() + 1545716
  const opCoName = `Test: Research filters ${id}`
  researchInput = fakeResearchData(Date.now() + 177877, id)

  test.beforeAll(async ({ request }) => {
    // create company
    const companyInput = {
      name: opCoName,
      number: id,
      taxonomy: tax3Key
    }
    const resp1 = await createCompany(request, companyInput)
    expect(resp1.status()).toBe(201)
    opCo = (await resp1.json()) as CompanySummary

    // create new user
    const resp2 = await createPerson(request, {
      email: `test-research_${id}@email.test`,
      familyName: `Test-research${id}`,
      givenName: `Test-research${id}`
    })
    expect(resp2.status()).toBe(201)
    person = await resp2.json()

    // add research item
    researchInput.companyId = opCo.id
    researchInput.authors = [person.email]
    const resp3 = await createResearch(request, researchInput)
    expect(resp3.status()).toBe(201)
    researchDoc = (await resp3.json()) as ResearchSummary
    await wait(1000)
    const resp4 = await request.get('/research/filters')
    expect(resp4.status()).toBe(200)
    filters = await resp4.json()
  })

  test.afterAll(async ({ request }, testInfo) => {
    if (!testInfo.error) {
      await deleteResearch(request, researchDoc.id)
      await deleteCompany(request, opCo.id)
      await deletePerson(request, person.email)
    }
  })

  // string fields
  const FILTERS1 = [
    { field: 'entity', value: opCoName },
    { field: 'taxonomyTag1', value: tax1Val },
    { field: 'taxonomyTag2', value: tax2Val },
    { field: 'taxonomyTag3', value: tax3Val }
  ]
  for (const f of FILTERS1) {
    test(`${f.field} filter contains value from research document`, async ({
      request
    }) => {
      // check that this value is one of the available filters for this field
      const filterObj = filters.content.filter(o => o.key === f.field)
      const opt = filterObj[0].options.filter(o => o.keyword === f.value)
      expect(opt[0].keyword).toBe(f.value)

      // apply filter and check for document
      let myMap = new Map<string, string[]>([[f.field, [f.value]]])
      const resp2 = await filterResearch(request, myMap)
      const json2 = await resp2.json()
      for (const d of json2.content) {
        expect.soft(d[f.field]).toBe(f.value)
      }
    })
  }

  // array fields
  const FILTERS2 = [
    { field: 'authors', value: researchInput.authors },
    { field: 'services', value: researchInput.services },
    { field: 'methods', value: researchInput.methods },
    { field: 'segments', value: researchInput.segments }
  ]
  for (const f of FILTERS2) {
    test(`${f.field} filter contains value from research document`, async ({
      request
    }) => {
      // find the options for this field
      const filterObj = filters.content.filter(o => o.key === f.field)
      const opt = filterObj[0].options.filter(o => f.value.includes(o.keyword))

      // check that this keyword is one of the options
      for (const o of opt) {
        expect.soft(f.value).toContain(o.keyword)
      }

      let myMap = new Map<string, string[]>([
        [f.field, [faker.helpers.arrayElements(f.value).toString()]]
      ])
      // apply filter and check for document
      const resp2 = await filterResearch(request, myMap)
      const json2 = await resp2.json()
      expect(json2.content.some(doc => doc[f.field] === f.value))
    })
  }
})
