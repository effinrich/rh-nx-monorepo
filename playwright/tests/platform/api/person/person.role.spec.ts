import { expect, test } from '@playwright/test'
import { ROLES } from '../../../../data/api/roles'
import {
  deletePerson,
  deletePersonRole,
  getPerson,
  updatePerson,
  updatePersonRole
} from '../../../../utils/platform/person'
import { PLATFORM_USERS } from '../../../../data/platform/users'

const USER_ROLES = [ROLES.admin, ROLES.rhUser, ROLES.coUser]
for (const ur of USER_ROLES) {
  test.describe(`Role CRUD - ${ur.display_name}`, async () => {
    test.describe.configure({ mode: 'serial' })
    let email
    test.beforeAll(async ({ request }) => {
      const now = Date.now()
      email = `test_${ur.authority}_${now}@email.test`.toLowerCase()
      const resp = await updatePerson(request, email, {
        givenName: `test_fn_${ur.authority}_${now}`,
        familyName: `test_ln_${ur.authority}_${now}`
      })
      await expect(resp.status()).toBe(200)
    })

    test.afterAll(async ({ request }) => {
      await deletePerson(request, email)
    })

    test(`Admin can add ${ur.display_name} role to user`, async ({
      request
    }) => {
      const resp = await updatePersonRole(request, email, ur.authority)
      expect(resp.status()).toBe(200)
    })

    test(`User now has ${ur.display_name} role`, async ({ request }) => {
      const resp = await getPerson(request, email)
      const json = await resp.json()
      expect(json.role).toEqual({
        authority: ur.authority,
        displayName: ur.display_name
      })
    })

    test(`Admin can delete ${ur.display_name} role from user`, async ({
      request
    }) => {
      const resp = await deletePersonRole(request, email, ur.authority)
      expect(resp.status()).toBe(200)
    })

    test(`User no longer has ${ur.display_name} role`, async ({ request }) => {
      const resp = await getPerson(request, email)
      const json = await resp.json()
      expect(json.roles).toEqual([])
      expect(json.role).toBe(undefined)
    })
  })
}

for (const ur of USER_ROLES) {
  test(`Cannot assign ${ur.authority} role to unknown user`, async ({
    request
  }) => {
    const resp = await updatePersonRole(
      request,
      'bogus@email.test',
      ur.authority
    )
    expect(resp.status()).toBe(404)
  })
}

test(`Cannot assign unknown role to user`, async ({ request }) => {
  const resp = await updatePersonRole(
    request,
    PLATFORM_USERS.coUser.email,
    'BOGUS'
  )
  expect(resp.status()).toBe(404)
})
