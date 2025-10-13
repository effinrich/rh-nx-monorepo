import { expect, test } from '@playwright/test'
import {
  createLibrary,
  deleteLibrary,
  getLibrary
} from '../../../../utils/platform/library'

import { updatePersonRole } from '../../../../utils/platform/person'
import { PLATFORM_USERS } from '../../../../data/platform/users'
import { ROLES } from '../../../../data/api/roles'

const TESTCASES = [
  { role: 'rhUser', expectedStatusCode: 200 },
  { role: 'coUser', expectedStatusCode: 200 },
  { role: 'noRole', expectedStatusCode: 403 }
]

test.describe('Permissions', async () => {
  let libraryId

  test.afterEach(async ({ request }) => {
    await deleteLibrary(request, libraryId)
  })

  for (const tc of TESTCASES) {
    test(`Library access - ${tc.role}`, async ({ request }) => {
      const libData = {
        displayName: `Test: Library access restrictions - ${tc.role}`
      }
      const postLibResp = await createLibrary(request, libData)
      expect(postLibResp.status()).toBe(201)
      const postLibRespJson = await postLibResp.json()
      expect(postLibRespJson.id).toBeTruthy()
      libraryId = postLibRespJson.id

      // set member role
      if (ROLES[tc.role] !== undefined) {
        const respRole = await updatePersonRole(
          request,
          PLATFORM_USERS[tc.role].email,
          ROLES[tc.role].authority
        )
      }

      const resp1 = await getLibrary(
        request,
        libraryId,
        PLATFORM_USERS[tc.role].email
      )

      expect(resp1.status()).toBe(tc.expectedStatusCode)
    })
  }
})
