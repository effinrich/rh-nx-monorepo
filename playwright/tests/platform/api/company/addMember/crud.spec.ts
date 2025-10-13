import { expect, test } from '@playwright/test'
import {
  COMPANY_COMMAND1,
  COMPANY_COMMAND2,
  PERSON_COMMAND1,
  PERSON_COMMAND2
} from '../../../../../data/api/testInput'
import {
  addMemberToCompany,
  createCompany,
  deleteCompany,
  removeMemberFromCompany
} from '../../../../../utils/platform/company'
import {
  createPerson,
  deletePerson
} from '../../../../../utils/platform/person'

/**
 * We had issues deleting members from a company if they were a member of
 * another company. For this test we use 2 companies & 2 users
 * - Create 2 companies & 2 users in beforeAll
 * - Add both members to company 1
 * - Add both members to company 2
 * - Ensure both companies have both members
 * - Remove both members from both companies
 * - Ensure both companies have no members
 * - Ensure both users are deleted (not in response from GET /person)
 * - Delete both companies in afterAll
 */
test.describe.configure({ mode: 'serial' })
test.describe('Company Member CRUD', () => {
  let company1: CompanySummary
  let company2: CompanySummary
  let person1: PersonSummary
  let person2: PersonSummary

  test.beforeAll(async ({ request }) => {
    // create 2 companies
    const resp1 = await createCompany(request, COMPANY_COMMAND1)
    expect(resp1.status()).toBe(201)
    company1 = await resp1.json()
    const resp2 = await createCompany(request, COMPANY_COMMAND2)
    expect(resp2.status()).toBe(201)
    company2 = await resp2.json()

    // create 2 users
    const resp3 = await createPerson(request, PERSON_COMMAND1)
    expect(resp3.status()).toBe(201)
    person1 = await resp3.json()
    const resp4 = await createPerson(request, PERSON_COMMAND2)
    expect(resp4.status()).toBe(201)
    person2 = await resp4.json()
  })

  test.afterAll(async ({ request }) => {
    const delResp1 = await deleteCompany(request, company1.id)
    expect(delResp1.status()).toBe(204)
    const delResp2 = await deleteCompany(request, company2.id)
    expect(delResp2.status()).toBe(204)
    const delResp3 = await deletePerson(request, person1.email)
    expect(delResp3.status()).toBe(204)
    const delResp4 = await deletePerson(request, person2.email)
    expect(delResp4.status()).toBe(204)
  })

  test('New Company has no members to start', async ({ request }) => {
    const getResp = await request.get(`/company/${company1.id}?expand=members`)
    expect(getResp.status()).toBe(200)
    const actualResp = (await getResp.json()) as CompanySummary
    expect(actualResp.members).toEqual([])
  })

  test('Admin can add 2 members to Company 1', async ({
    request
  }, testInfo) => {
    const putResp1 = await addMemberToCompany(
      request,
      company1.id,
      person1.email
    )
    expect(putResp1.status()).toBe(200)
    const putResp2 = await addMemberToCompany(
      request,
      company1.id,
      person2.email
    )
    expect(putResp2.status()).toBe(200)
  })

  test('Admin can add 2 members to Company 2', async ({ request }) => {
    const putResp1 = await addMemberToCompany(
      request,
      company2.id,
      person1.email
    )
    expect(putResp1.status()).toBe(200)
    const putResp2 = await addMemberToCompany(
      request,
      company2.id,
      person2.email
    )
    expect(putResp2.status()).toBe(200)
  })

  test('Company 1 has the 2 members that were added', async ({ request }) => {
    const getResp = await request.get(`/company/${company1.id}/members`, {})
    expect(getResp.status()).toBe(200)
    const actualResp = (await getResp.json()) as List<PersonSummary>
    expect(actualResp.content.length).toBe(2)
    expect(actualResp.content[0]).toMatchObject(PERSON_COMMAND1)
    expect(actualResp.content[1]).toMatchObject(PERSON_COMMAND2)
  })

  test('Company 2 has the 2 members that were added', async ({ request }) => {
    const getResp = await request.get(`/company/${company2.id}/members`, {})
    expect(getResp.status()).toBe(200)
    const actualResp = (await getResp.json()) as List<PersonSummary>
    expect(actualResp.content.length).toBe(2)
    expect(actualResp.content[0]).toMatchObject(PERSON_COMMAND1)
    expect(actualResp.content[1]).toMatchObject(PERSON_COMMAND2)
  })

  test('Admin can delete the 2 members from Company 1', async ({ request }) => {
    const deleteResp1 = await removeMemberFromCompany(
      request,
      company1.id,
      PERSON_COMMAND1.email
    )
    expect(deleteResp1.status()).toBe(200)
    const deleteResp2 = await removeMemberFromCompany(
      request,
      company1.id,
      PERSON_COMMAND2.email
    )
    expect(deleteResp2.status()).toBe(200)
  })

  test('Admin can delete the 2 members from Company 2', async ({ request }) => {
    const deleteResp1 = await removeMemberFromCompany(
      request,
      company2.id,
      PERSON_COMMAND1.email
    )
    expect(deleteResp1.status()).toBe(200)
    const deleteResp2 = await removeMemberFromCompany(
      request,
      company2.id,
      PERSON_COMMAND2.email
    )
    expect(deleteResp2.status()).toBe(200)
  })

  test('Company 1 no longer has any members', async ({ request }) => {
    const getResp = await request.get(`/company/${company1.id}/members`, {})
    expect(getResp.status()).toBe(200)
    const actualResp = (await getResp.json()) as List<PersonSummary>
    expect(actualResp.content.length).toBe(0)
  })

  test('Company 2 no longer has any members', async ({ request }) => {
    const getResp = await request.get(`/company/${company2.id}/members`, {})
    expect(getResp.status()).toBe(200)
    const actualResp = (await getResp.json()) as List<PersonSummary>
    expect(actualResp.content.length).toBe(0)
  })

  test('Cannot assign user to unknown Company', async ({ request }) => {
    const putResp = await addMemberToCompany(
      request,
      'bogus',
      PERSON_COMMAND1.email
    )
    expect(putResp.status()).toBe(404)
  })

  test('Cannot assign unknown user Company', async ({ request }) => {
    const putResp = await addMemberToCompany(
      request,
      company1.id,
      'bogus@email.com'
    )
    expect(putResp.status()).toBe(404)
  })
})
