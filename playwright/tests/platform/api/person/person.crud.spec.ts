import { expect, test } from '@playwright/test'
import { deletePerson } from '../../../../utils/platform/person'

test.describe('Person CRUD', () => {
  test.describe.configure({ mode: 'serial' })

  const TIMESTAMP = Date.now()
  const EMAIL = `persontest_${TIMESTAMP}@email.test`
  const FAMILY_NAME = `FamilyName_${TIMESTAMP}`
  const GIVEN_NAME = `GivenName_${TIMESTAMP}`
  let person: PersonSummary

  test.afterAll(async ({ request }) => {
    await deletePerson(request, person.email)
  })

  test('Admin can create a new Person', async ({ baseURL, request }) => {
    const postResp = await request.post(`person`, {
      data: {
        givenName: GIVEN_NAME,
        familyName: FAMILY_NAME,
        email: EMAIL
      }
    })
    expect(postResp.status()).toBe(201)
    person = (await postResp.json()) as PersonSummary
    const after = new Date()
    await expect.soft(person.email).toBe(EMAIL)
    await expect.soft(person.givenName).toBe(GIVEN_NAME)
    await expect.soft(person.familyName).toBe(FAMILY_NAME)
    await expect.soft(person.roles).toEqual([])
    await expect.soft(person.memberOf).toEqual([])
    await expect.soft(person.lastModified).toEqual(person.created)
    await expect.soft(person.links[0]).toStrictEqual({
      rel: 'self',
      href: `${baseURL}/person/${EMAIL}`
    })

    await expect
      .soft(new Date(person.created).valueOf())
      .toBeLessThanOrEqual(after.valueOf())
  })

  test('Admin can GET newly created person', async ({
    request
  }) => {
    let getResp = await request.get(`/person/${EMAIL}`)
    expect(getResp.status()).toBe(200)
    const actualResponse = await getResp.json() as PersonSummary
    expect(actualResponse).toStrictEqual(person)
  })

  test('Admin can update person', async ({ baseURL, request }) => {
    const givenName = 'NewGivenName'
    const familyName = 'NewFamilyName'

    const putResp = await request.put(`/person/${EMAIL}`, {
      data: {
        givenName: givenName,
        familyName: familyName
      }
    })
    expect(putResp.status()).toBe(200)
    person = await putResp.json()
    expect.soft(person.givenName).toBe(givenName)
    expect.soft(person.familyName).toBe(familyName)
    const modified = new Date(person.lastModified).valueOf()
    await expect
      .soft(modified)
      .toBeGreaterThanOrEqual(new Date(person.created).valueOf())
    await expect.soft(modified).toBeLessThanOrEqual(new Date().valueOf())
  })

  test('Email must be unique', async ({ request }) => {
    const postResp = await request.post('/person', {
      data: {
        email: EMAIL,
        givenName: 'gName',
        familyName: 'fname'
      }
    })
    expect(postResp.status()).toBe(422)
    const json = await postResp.json()
    expect(json.errors[0].name).toBe('email')
    expect(json.errors[0].rejectedValue).toBe(EMAIL)
    expect(json.errors[0].description).toBe('must be unique')
  })
})

test.describe('Person CRUD', () => {
  test.describe.configure({ mode: 'parallel' })

  test('Admin can GET all people', async ({ request }) => {
    const resp = await request.get('/person?sort=created%2Cdesc')
    expect(resp.status()).toBe(200)
    const allPeople = await resp.json()
    expect.soft(allPeople.content.length).toBeGreaterThanOrEqual(1)
    expect.soft(allPeople.links).toBeTruthy()
    expect.soft(allPeople.page).toBeTruthy()
    expect.soft(allPeople.content[0].created).toBeTruthy()
    expect.soft(allPeople.content[0].lastModified).toBeTruthy()
  })

  test('Email field is required', async ({ request }) => {
    const postResp = await request.post(`person`, {
      data: {
        familyName: 'familyName',
        givenName: 'givenName'
      }
    })
    expect(postResp.status()).toBe(422)
    const resp = await postResp.json()
    expect(resp).toMatchObject({
      status: 422,
      error: '422 UNPROCESSABLE_ENTITY',
      message: 'Invalid field values',
      errors: [
        {
          name: 'email',
          description: 'must not be blank'
        }
      ]
    })
    const timestampInMilli = new Date(resp.timestamp).valueOf()
    expect(timestampInMilli).toBeLessThanOrEqual(Date.now())
  })
})
