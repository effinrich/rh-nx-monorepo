import { expect, test } from '@playwright/test'
import {
  createCompany,
  deleteCompany,
  removeMemberFromCompany
} from '../../../../../utils/platform/company'
import {
  createPerson,
  deletePerson
} from '../../../../../utils/platform/person'

/**
 * Setup:
 *  - Create 2 new users
 *  - Create 1 new company
 * 1. INSERT as ACTIVE (user1)
 * 2. INSERT as INACTIVE (user2)
 * 3. UPDATE to INACTIVE (user1)
 * 4. UPDATE to ACTIVE (user2)
 * 5. UPDATE_BY_COMPANY (PAUSED)
 * 6. No new log entry when company is set to ACTIVE
 * 7. UPDATE_BY_COMPANY (ARCHIVED)
 * 8. DELETE when ACTIVE (user1)
 * 9. DELETE_BY_COMPANY when INACTIVE (user2)
 */
test.describe.configure({ mode: 'serial' })
test.describe('Company Member CRUD', () => {
  let opco: CompanySummary
  let user1: PersonSummary
  let user2: PersonSummary
  let userInfo

  test.beforeAll(async ({ request }) => {
    const now = Date.now()
    // create 2 users
    const resp1 = await createPerson(request, {
      email: `user1-log-test_${now}@email.test`,
      familyName: `Test-user1-log_fn${now}`,
      givenName: `Test-user1-log_ln${now}`
    })
    expect(resp1.status()).toBe(201)
    user1 = await resp1.json()
    const resp2 = await createPerson(request, {
      email: `user2-log-test_${now}@email.test`,
      familyName: `Test-user2-log_fn${now}`,
      givenName: `Test-user2-log_ln${now}`
    })
    expect(resp2.status()).toBe(201)
    user2 = await resp2.json()

    // create company
    const resp3 = await createCompany(request, {
      name: `Test: user logging ${now}`,
      number: now
    })
    expect(resp3.status()).toBe(201)
    opco = await resp3.json()

    // get current user (to check log entries)
    const resp4 = await request.get('/userinfo')
    userInfo = await resp4.json()
  })

  test.afterAll(async ({ request }) => {
    try {
      await deleteCompany(request, opco.id)
    } catch (e) {}
    try {
      await deletePerson(request, user1.email)
    } catch (e) {}
    try {
      await deletePerson(request, user2.email)
    } catch (e) {}
  })

  test('1. INSERT as ACTIVE (user1)', async ({ request }) => {
    // add user1
    const resp1 = await request.put(
      `/company/${opco.id}/member/${user1.email}`,
      {
        data: {
          status: 'ACTIVE'
        }
      }
    )
    expect(resp1.status()).toBe(200)

    // check log
    const resp2 = await request.get(`/person/${user1.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json = await resp2.json()
    expect.soft(json.email).toEqual(user1.email)
    expect.soft(json.changes).toHaveLength(1)
    expect.soft(json.changes[0].companyName).toBe(opco.name)
    expect.soft(json.changes[0].status).toBe('ACTIVE')
    expect.soft(json.changes[0].operation).toBe('INSERT')
    expect.soft(json.changes[0].createdBy).toBe(userInfo.email)
  })

  test('2. INSERT as INACTIVE (user2)', async ({ request }) => {
    // add user2
    const resp1 = await request.put(
      `/company/${opco.id}/member/${user2.email}`,
      {
        data: {
          status: 'INACTIVE'
        }
      }
    )
    expect(resp1.status()).toBe(200)

    // check log
    const resp2 = await request.get(`/person/${user2.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json = await resp2.json()
    expect.soft(json.email).toEqual(user2.email)
    expect.soft(json.changes).toHaveLength(1)
    expect.soft(json.changes[0].companyName).toBe(opco.name)
    expect.soft(json.changes[0].status).toBe('INACTIVE')
    expect.soft(json.changes[0].operation).toBe('INSERT')
    expect.soft(json.changes[0].createdBy).toBe(userInfo.email)
  })

  test('3. UPDATE to INACTIVE (user1)', async ({ request }) => {
    // update status
    const resp = await request.put(
      `/company/${opco.id}/member/${user1.email}`,
      {
        data: {
          status: 'INACTIVE'
        }
      }
    )
    expect(resp.status()).toBe(200)

    // check log
    const resp2 = await request.get(`/person/${user1.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json = await resp2.json()
    expect.soft(json.email).toEqual(user1.email)
    expect.soft(json.changes).toHaveLength(2)
    expect.soft(json.changes[1].companyName).toBe(opco.name)
    expect.soft(json.changes[1].status).toBe('ACTIVE')
    expect.soft(json.changes[1].operation).toBe('UPDATE')
    expect.soft(json.changes[1].createdBy).toBe(userInfo.email)
  })

  test('4. UPDATE to ACTIVE (user2)', async ({ request }) => {
    // update status
    const resp = await request.put(
      `/company/${opco.id}/member/${user2.email}`,
      {
        data: {
          status: 'ACTIVE'
        }
      }
    )
    expect(resp.status()).toBe(200)
    // check log
    const resp2 = await request.get(`/person/${user2.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json = await resp2.json()
    expect.soft(json.email).toEqual(user2.email)
    expect.soft(json.changes).toHaveLength(2)
    expect.soft(json.changes[1].companyName).toBe(opco.name)
    expect.soft(json.changes[1].status).toBe('INACTIVE')
    expect.soft(json.changes[1].operation).toBe('UPDATE')
    expect.soft(json.changes[1].createdBy).toBe(userInfo.email)
  })

  test('5. UPDATE_BY_COMPANY (PAUSED)', async ({ request }) => {
    // update company status
    const resp1 = await request.put(`/company/${opco.id}`, {
      data: {
        name: opco.name,
        status: 'PAUSED'
      }
    })
    expect(resp1.status()).toBe(200)
    // check user1 no change logged
    const resp2 = await request.get(`/person/${user1.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json2 = await resp2.json()
    expect.soft(json2.email).toEqual(user1.email)
    expect.soft(json2.changes).toHaveLength(2)
    expect.soft(json2.changes[1].companyName).toBe(opco.name)
    expect.soft(json2.changes[1].status).toBe('ACTIVE')
    expect.soft(json2.changes[1].operation).toBe('UPDATE')
    expect.soft(json2.changes[1].createdBy).toBe(userInfo.email)

    // check user2
    const resp3 = await request.get(`/person/${user2.email}/changes`)
    expect(resp3.status()).toBe(200)
    const json3 = await resp3.json()
    expect.soft(json3.email).toEqual(user2.email)
    expect.soft(json3.changes).toHaveLength(3)
    expect.soft(json3.changes[2].companyName).toBe(opco.name)
    expect.soft(json3.changes[2].status).toBe('ACTIVE')
    expect.soft(json3.changes[2].operation).toBe('UPDATE_BY_COMPANY')
    expect.soft(json3.changes[2].createdBy).toBe(userInfo.email)
  })

  test('6. No new log entry when company is set to ACTIVE', async ({
    request
  }) => {
    // update company status
    const resp1 = await request.put(`/company/${opco.id}`, {
      data: {
        name: opco.name,
        status: 'ACTIVE'
      }
    })
    expect(resp1.status()).toBe(200)
    // check user status for both users
    const resp2 = await request.get(`/person/${user1.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json2 = await resp2.json()
    expect.soft(json2.changes).toHaveLength(2)
    expect.soft(json2.changes[1].status).toBe('ACTIVE')
    expect.soft(json2.changes[1].operation).toBe('UPDATE')

    const resp3 = await request.get(`/person/${user2.email}/changes`)
    expect(resp3.status()).toBe(200)
    const json3 = await resp3.json()
    expect.soft(json3.changes).toHaveLength(3)
    expect.soft(json3.changes[2].status).toBe('ACTIVE')
    expect.soft(json3.changes[2].operation).toBe('UPDATE_BY_COMPANY')
  })

  test('7. UPDATE_BY_COMPANY (ARCHIVED)', async ({ request }) => {
    // update user1 to ACTIVE
    const resp1 = await request.put(
      `/company/${opco.id}/member/${user1.email}`,
      {
        data: {
          name: opco.name,
          status: 'ACTIVE'
        }
      }
    )
    expect(resp1.status()).toBe(200)
    // check user1 change log
    const resp2 = await request.get(`/person/${user1.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json2 = await resp2.json()
    expect.soft(json2.email).toEqual(user1.email)
    expect.soft(json2.changes).toHaveLength(3)
    expect.soft(json2.changes[2].companyName).toBe(opco.name)
    expect.soft(json2.changes[2].status).toBe('INACTIVE')
    expect.soft(json2.changes[2].operation).toBe('UPDATE')
    expect.soft(json2.changes[2].createdBy).toBe(userInfo.email)

    // update company status to ARCHIVED
    const resp3 = await request.put(`/company/${opco.id}`, {
      data: {
        name: opco.name,
        status: 'ARCHIVED'
      }
    })
    expect(resp3.status()).toBe(200)
    // check log for both users
    const resp4 = await request.get(`/person/${user1.email}/changes`)
    expect(resp4.status()).toBe(200)
    const json4 = await resp4.json()
    expect.soft(json4.email).toEqual(user1.email)
    expect.soft(json4.changes).toHaveLength(4)
    expect.soft(json4.changes[3].companyName).toBe(opco.name)
    expect.soft(json4.changes[3].status).toBe('ACTIVE')
    expect.soft(json4.changes[3].operation).toBe('UPDATE_BY_COMPANY')
    expect.soft(json4.changes[3].createdBy).toBe(userInfo.email)

    const resp5 = await request.get(`/person/${user2.email}/changes`)
    expect(resp5.status()).toBe(200)
    const json5 = await resp5.json()
    expect.soft(json5.email).toEqual(user2.email)
    expect.soft(json5.changes).toHaveLength(3)
    expect.soft(json5.changes[2].status).toBe('ACTIVE')
    expect.soft(json5.changes[2].operation).toBe('UPDATE_BY_COMPANY')
  })

  test('8. DELETE when ACTIVE (user1)', async ({ request }) => {
    // set company ACTIVE
    const resp1 = await request.put(`/company/${opco.id}`, {
      data: {
        name: opco.name,
        status: 'ACTIVE'
      }
    })
    expect(resp1.status()).toBe(200)

    // set user1 ACTIVE
    const resp2 = await request.put(
      `/company/${opco.id}/member/${user1.email}`,
      {
        data: {
          status: 'ACTIVE'
        }
      }
    )
    expect(resp2.status()).toBe(200)
    const resp3 = await request.get(`/person/${user1.email}/changes`)
    expect(resp3.status()).toBe(200)
    const json3 = await resp3.json()
    expect.soft(json3.changes).toHaveLength(5)
    expect.soft(json3.changes[4].companyName).toBe(opco.name)
    expect.soft(json3.changes[4].status).toBe('INACTIVE')
    expect.soft(json3.changes[4].operation).toBe('UPDATE')
    expect.soft(json3.changes[4].createdBy).toBe(userInfo.email)

    // remove user1
    const resp6 = await removeMemberFromCompany(request, opco.id, user1.email)
    expect(resp6.status()).toBe(200)

    // check log
    const resp7 = await request.get(`/person/${user1.email}/changes`)
    expect(resp7.status()).toBe(200)
    const json7 = await resp7.json()
    expect.soft(json7.changes).toHaveLength(6)
    expect.soft(json7.changes[5].companyName).toBe(opco.name)
    expect.soft(json7.changes[5].status).toBe('ACTIVE')
    expect.soft(json7.changes[5].operation).toBe('DELETE')
    expect.soft(json7.changes[5].createdBy).toBe(userInfo.email)
  })

  test('9. DELETE_BY_COMPANY when INACTIVE (user2)', async ({ request }) => {
    // delete company
    const resp1 = await deleteCompany(request, opco.id)
    expect(resp1.status()).toBe(204)

    const resp2 = await request.get(`/person/${user2.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json2 = await resp2.json()
    expect.soft(json2.changes).toHaveLength(4)
    expect.soft(json2.changes[3].companyName).toBe(opco.name)
    expect.soft(json2.changes[3].status).toBe('INACTIVE')
    expect.soft(json2.changes[3].operation).toBe('DELETE_BY_COMPANY')
    expect.soft(json2.changes[3].createdBy).toBe(userInfo.email)
  })

  test('10. User log persists after deleting person', async ({ request }) => {
    const resp = await deletePerson(request, user1.email)
    expect(resp.status()).toBe(204)

    const resp2 = await request.get(`/person/${user1.email}/changes`)
    expect(resp2.status()).toBe(200)
    const json2 = await resp2.json()
    expect.soft(json2.changes).toHaveLength(6)
  })
})
