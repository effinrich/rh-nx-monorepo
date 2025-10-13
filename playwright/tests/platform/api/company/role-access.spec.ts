import { expect, test } from '@playwright/test'
import {
  addMemberToCompany,
  createCompany,
  deleteCompany,
  getCompany
} from '../../../../utils/platform/company'
import { updatePersonRole } from '../../../../utils/platform/person'
import { PLATFORM_USERS } from '../../../../data/platform/users'
import { ROLES } from '../../../../data/api/roles'

test.afterEach(async ({ request }, testInfo) => {
  await deleteCompany(request, testInfo.annotations[0].description)
})

const TEST_USERS = ['rhUser', 'coUser']
for (const idx in TEST_USERS) {
  const role = TEST_USERS[idx]
  test(`Company access - ${role}`, async ({ request }) => {
    const id = `${Date.now()}${idx}`
    const coData = {
      name: `Test: Company access restrictions - ${role}`,
      number: id
    }
    const postCoResp = await createCompany(request, coData)
    expect(postCoResp.status()).toBe(201)
    const postRespJson = await postCoResp.json()
    expect(postRespJson.id).toBeTruthy()
    const coId = postRespJson.id
    test.info().annotations.push({ type: 'coId', description: coId })

    // set member role
    const respRole = await updatePersonRole(
      request,
      PLATFORM_USERS[role].email,
      ROLES[role].authority
    )
    expect(respRole.status()).toBe(200)

    // non-member gets 403
    const resp1 = await getCompany(request, coId, PLATFORM_USERS[role].email)
    expect(resp1.status()).toBe(403)

    // add member
    const putResp = await addMemberToCompany(
      request,
      coId,
      PLATFORM_USERS[role].email
    )
    expect(putResp.status()).toBe(200)

    // member gets 200
    const resp4 = await getCompany(request, coId, PLATFORM_USERS[role].email)
    expect(resp4.status()).toBe(200)
  })
}
