import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  testCompanyData,
  updateCompany
} from '../../../../utils/platform/company'
import { faker } from '@faker-js/faker'
import { randomTaxonomy } from '../../../../data/platform/company-taxonomy'

test('Name is required', async ({ request }) => {
  const input = testCompanyData()
  delete input.name
  const resp = await createCompany(request, input)
  expect(resp.status()).toBe(422)
  const json = await resp.json()
  expect(json.errors).toStrictEqual([
    {
      name: 'name',
      description: 'must not be blank'
    }
  ])
})

const testcases = [
  {
    key: 'number',
    value: faker.number.int({ min: 0 }),
    newValue: faker.number.int({ min: 0 })
  },
  {
    key: 'legalName',
    value: 'Legal name: ' + faker.company.name(),
    newValue: 'New legal name ' + faker.company.name()
  },
  {
    key: 'description',
    value: faker.company.catchPhrase(),
    newValue: 'New description: ' + faker.company.catchPhrase()
  },
  { key: 'href', value: faker.internet.url(), newValue: faker.internet.url() },
  {
    key: 'dashboardHref',
    value: faker.internet.url(),
    newValue: faker.internet.url()
  },
  {
    key: 'hasPlatformAgreement',
    value: faker.datatype.boolean(),
    newValue: faker.datatype.boolean()
  }
]
test.describe('Optional fields', () => {
  let opco: CompanySummary

  test.afterEach(async ({ request }) => {
    await deleteCompany(request, opco.id)
  })

  for (const tc of testcases) {
    test(tc.key, async ({ request }) => {
      // create
      const input = {
        name: faker.company.name()
      }
      input[tc.key] = tc.value
      let resp = await createCompany(request, input)
      expect(resp.status()).toBe(201)
      opco = (await resp.json()) as CompanySummary
      expect.soft(opco[tc.key]).toBe(tc.value)

      // get
      resp = await getCompany(request, opco.id)
      expect(resp.status()).toBe(200)
      opco = await resp.json()
      expect.soft(opco[tc.key]).toBe(tc.value)

      // update
      input[tc.key] = tc.newValue
      resp = await updateCompany(request, opco.id, input)
      expect(resp.status()).toBe(200)
      opco = (await resp.json()) as CompanySummary
      expect.soft(opco[tc.key]).toBe(tc.newValue)

      // get
      resp = await getCompany(request, opco.id)
      expect(resp.status()).toBe(200)
      opco = await resp.json()
      expect.soft(opco[tc.key]).toBe(tc.newValue)
    })
  }

  test('taxonomy', async ({ request }) => {
    const taxonomy = randomTaxonomy()
    const expectedTaxonomy = [
      { displayName: taxonomy[0].value, level: 1, value: taxonomy[0].key },
      { displayName: taxonomy[1].value, level: 2, value: taxonomy[1].key },
      { displayName: taxonomy[2].value, level: 3, value: taxonomy[2].key }
    ]
    const update = randomTaxonomy()
    const expUpdate = [
      { displayName: update[0].value, level: 1, value: update[0].key },
      { displayName: update[1].value, level: 2, value: update[1].key },
      { displayName: update[2].value, level: 3, value: update[2].key }
    ]

    // create
    const input = {
      name: faker.company.name()
    }
    input['taxonomy'] = taxonomy[2].key
    let resp = await createCompany(request, input)
    expect(resp.status()).toBe(201)
    opco = (await resp.json()) as CompanySummary
    expect.soft(opco.taxonomy).toStrictEqual(expectedTaxonomy)

    // get
    resp = await getCompany(request, opco.id)
    expect(resp.status()).toBe(200)
    opco = await resp.json()
    expect.soft(opco.taxonomy).toStrictEqual(expectedTaxonomy)

    // update
    input['taxonomy'] = update[2].key
    resp = await updateCompany(request, opco.id, input)
    expect(resp.status()).toBe(200)
    opco = (await resp.json()) as CompanySummary
    expect.soft(opco.taxonomy).toStrictEqual(expUpdate)

    // get
    resp = await getCompany(request, opco.id)
    expect(resp.status()).toBe(200)
    opco = await resp.json()
    expect.soft(opco.taxonomy).toStrictEqual(expUpdate)
  })
})
