import { expect, test } from '@playwright/test'
import {
  deletePerson,
  getPerson,
  testPersonGenerator
} from '../../../../utils/platform/person'
import {
  addMemberToCompany,
  deleteCompany,
  testCompanyGenerator
} from '../../../../utils/platform/company'
import { deleteCEO, testCEOGenerator } from '../../../../utils/platform/ceo'

test.describe('CEO info in Person', () => {
  let person: PersonSummary
  let opco: CompanySummary
  let ceo: CEOSummary

  test.afterEach(async ({ request }) => {
    await deleteCEO(request, ceo.id)
    await deleteCompany(request, opco.id)
    await deletePerson(request, person.email)
  })
  test('Admin can create a new Person', async ({ request }) => {
    person = await testPersonGenerator(request)
    opco = await testCompanyGenerator(request)
    await addMemberToCompany(request, opco.id, person.email)
    ceo = await testCEOGenerator(request, { email: person.email })
    let resp = await getPerson(request, person.email)
    let json = await resp.json()
    expect.soft(json.ceoInfo).toStrictEqual({ id: ceo.id, ceo: true })
  })
})
