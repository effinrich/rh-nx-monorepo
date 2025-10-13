import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany
} from '../../../../utils/platform/company'
import { faker } from '@faker-js/faker'

test.describe.configure({ mode: 'serial' })
test.describe('Company CRUD', () => {
  const now = Date.now()
  const name = `Test Company ${now}`
  const desc = `Test Company description ${now}`
  const legalName = `Test Company Legal Name ${now}`
  const newName = `New Name ${now}`
  const newDesc = `New Desc ${now}`
  const newLegalName = `New Legal Name ${now}`
  const platformAgreement: boolean = faker.datatype.boolean()

  let company: CompanySummary

  test('Admin can create a new Company', async ({ baseURL, request }) => {
    const postResp = await createCompany(request, {
      name: name,
      number: now,
      description: desc,
      legalName: legalName
    })
    expect(postResp.status()).toBe(201)
    company = await postResp.json()
    // ensure id field is present
    expect(company.id).toBeTruthy()
    expect.soft(company.name).toEqual(name)
    expect.soft(company.number).toEqual(now)
    expect.soft(company.legalName).toEqual(legalName)
    expect.soft(company.description).toEqual(desc)
    expect.soft(company.stage).toEqual('OP_CO')
    expect.soft(company.status).toEqual('ACTIVE')
    expect.soft(company.members).toEqual([])
    expect(company.created).toEqual(company.lastModified)
  })

  test('Admin can GET newly created Company', async ({ baseURL, request }) => {
    const getResp = await getCompany(request, company.id)
    expect(getResp.status()).toBe(200)
    const actualGetResp = await getResp.json()
    expect.soft(actualGetResp.name).toEqual(name)
    expect.soft(actualGetResp.number).toEqual(now)
    expect.soft(actualGetResp.legalName).toEqual(legalName)
    expect.soft(actualGetResp.description).toEqual(desc)
    expect.soft(actualGetResp.stage).toEqual('OP_CO')
    expect.soft(actualGetResp.status).toEqual('ACTIVE')
    expect.soft(actualGetResp.created).toMatch(/202[0-9-T:.Z]/)
    expect(actualGetResp.lastModified).toMatch(/202[0-9-T:.Z]/)
  })

  test('Admin can update a Company', async ({ baseURL, request }) => {
    const putResp = await updateCompany(request, company.id, {
      name: newName,
      number: now,
      description: newDesc,
      legalName: newLegalName,
      hasPlatformAgreement: platformAgreement
    })
    expect(putResp.status()).toBe(200)
    const actualPutResp = await putResp.json()
    expect.soft(actualPutResp.name).toEqual(newName)
    expect.soft(actualPutResp.number).toEqual(now)
    expect.soft(actualPutResp.legalName).toEqual(newLegalName)
    expect.soft(actualPutResp.description).toEqual(newDesc)
    expect.soft(actualPutResp.stage).toEqual('OP_CO')
    expect.soft(actualPutResp.status).toEqual('ACTIVE')
    expect.soft(actualPutResp.created).toMatch(/202[0-9-T:.Z]/)
    expect(actualPutResp.lastModified).toMatch(/202[0-9-T:.Z]/)
  })

  test('Admin can GET updated Company', async ({ baseURL, request }) => {
    const getResp = await getCompany(request, company.id)
    expect(getResp.status()).toBe(200)
    const actualGetResp = await getResp.json()
    expect.soft(actualGetResp.name).toEqual(newName)
    expect.soft(actualGetResp.number).toEqual(now)
    expect.soft(actualGetResp.legalName).toEqual(newLegalName)
    expect.soft(actualGetResp.description).toEqual(newDesc)
    expect.soft(actualGetResp.stage).toEqual('OP_CO')
    expect.soft(actualGetResp.status).toEqual('ACTIVE')
    expect.soft(actualGetResp.hasPlatformAgreement).toBe(platformAgreement)
    expect.soft(actualGetResp.created).toMatch(/202[0-9-T:.Z]/)
    expect(actualGetResp.lastModified).toMatch(/202[0-9-T:.Z]/)
  })

  test('Admin can GET all Companies', async ({ request }) => {
    const resp = await getCompanies(request)
    expect(resp.status()).toBe(200)
    const companies = await resp.json()
    expect.soft(companies.content.length).toBeGreaterThanOrEqual(1)
  })

  test('Company number must be unique (POST)', async ({ request }) => {
    const newTimestamp = Date.now() + 1
    const postResp = await createCompany(request, {
      name: `New Company ${newTimestamp}`,
      number: now,
      description: `New Test Company ${newTimestamp}`,
      legalName: `New Test Company Legal Name ${newTimestamp}`
    })
    expect(postResp.status()).toBe(422)
    const json = await postResp.json()
    expect(json.errors[0].name).toBe('number')
    expect(json.errors[0].rejectedValue).toBe(`${now}`)
    expect(json.errors[0].description).toBe('must be unique')
  })

  test('Cannot update company number to a number that is already in use', async ({
    request
  }) => {
    const newTimestamp = Date.now() + 2
    const newCoResp = await createCompany(request, {
      name: `Pre-existing Company ${newTimestamp}`,
      number: newTimestamp,
      description: `Description: Pre-existing Company ${newTimestamp}`,
      legalName: `Legal Name: Pre-existing Company ${newTimestamp}`
    })
    expect(newCoResp.status()).toBe(201)
    const newCoJson = await newCoResp.json()
    const putResp = await updateCompany(request, company.id, {
      ...company,
      fundraiseStatus: company.fundraiseStatus.value,
      number: newCoJson.number
    })
    expect(putResp.status()).toBe(422)
    const json = await putResp.json()
    expect(json.errors[0].name).toBe('number')
    expect(json.errors[0].rejectedValue).toBe(`${newCoJson.number}`)
    expect(json.errors[0].description).toBe('must be unique')
    const delResp = await deleteCompany(request, newCoJson.id)
    expect(delResp.status()).toBe(204)
  })

  test('Admin can delete a Company', async ({ request }) => {
    const delResp = await deleteCompany(request, company.id)
    expect(delResp.status()).toBe(204)
  })

  test('Deleted Company no longer exists', async ({ request }) => {
    const getResp = await getCompany(request, company.id)
    expect(getResp.status()).toBe(404)
  })

  test('Name field is required', async ({ request }) => {
    const now = Date.now() + 3
    const resp = await createCompany(request, {
      number: now,
      description: `Desc: No name test - ${now}`,
      legalName: `Legal Name: No name test - ${now}`
    })
    expect(resp.status()).toBe(422)
    const json = await resp.json()
    expect(json.errors[0].description).toBe('must not be blank')
  })
})
