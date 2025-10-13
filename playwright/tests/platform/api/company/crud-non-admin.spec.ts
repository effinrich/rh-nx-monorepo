import { expect, test } from '@playwright/test'
import {
  FundraiseStatus,
  addMemberToCompany,
  createCompany,
  deleteCompany,
  testCompanyData,
  testCompanyGenerator,
  updateCompany
} from '../../../../utils/platform/company'
import {
  deletePerson,
  testPersonGenerator
} from '../../../../utils/platform/person'
import { ROLES } from '../../../../data/platform/users'

const noPermissionRoles = [ROLES.rhUser, ROLES.coUser]

test.describe('No-permission roles cannot create a company', () => {
  let person: PersonSummary

  test.afterEach(async ({ request }) => {
    await deletePerson(request, person.email)
  })

  for (const role of noPermissionRoles) {
    test(role.displayName, async ({ request }) => {
      person = await testPersonGenerator(request, {
        role: role.authority
      })
      const input = testCompanyData()
      const resp = await createCompany(request, input, person.email)
      expect(resp.status()).toBe(403)
    })
  }
})

test.describe('No-permission roles cannot update a company', () => {
  let person: PersonSummary
  let opco: CompanySummary

  test.beforeEach(async ({ request }) => {
    opco = await testCompanyGenerator(request)
  })

  test.afterEach(async ({ request }) => {
    await deletePerson(request, person.email)
    await deleteCompany(request, opco.id)
  })

  for (const role of noPermissionRoles) {
    test(role.displayName, async ({
      request
    }) => {
      // create person
      person = await testPersonGenerator(request, {
        role: role.authority
      })

      // add member to opco
      let resp = await addMemberToCompany(request, opco.id, person.email)
      expect(resp.status()).toBe(200)

      // member tries to update company fundraiseStatus
      resp = await updateCompany(
        request,
        opco.id,
        {
          name: opco.name,
          fundraiseStatus: FundraiseStatus.SERIES_A.value
        },
        person.email
      )
      expect(resp.status()).toBe(403)
    })
  }
})
