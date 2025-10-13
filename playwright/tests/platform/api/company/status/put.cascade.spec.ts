import { expect, test } from '@playwright/test'
import {
  addMemberToCompany,
  createCompany,
  createNewCo,
  deleteCompany,
  getCompany,
  getCompanyMemberStatus,
  updateCompany
} from '../../../../../utils/platform/company'
import {
  createPerson,
  deletePerson
} from '../../../../../utils/platform/person'
import { wait } from '../../../../../utils/platform/utils'

/**
 * https://redesignhealth.atlassian.net/browse/PUD-117
 * 1. if a company is set in PAUSED or ARCHIVED all members of the company
 *    should be set to INACTIVE
 * 2. if a company is returned to ACTIVE from PAUSED or ARCHIVED all members
 *    of the company shall remain INACTIVE and must be manually reset to ACTIVE
 */
test.describe.configure({ mode: 'serial' })
test.describe('Entity status cascades to member status', () => {
  let theme: CompanySummary
  let concept: CompanySummary
  let person: PersonSummary
  let entities = {}
  const newCoInput = {
    name: 'Test: 1687984973',
    stage: 'NEW_CO',
    number: 1687984973
  }
  const opCoInput = {
    name: 'Test: 1687984974',
    stage: 'OP_CO',
    number: 1687984974
  }
  const personInput = {
    givenName: 'Test 1687984975',
    familyName: 'Test 1687984975',
    email: 'test_1687984975@email.test'
  }

  test.beforeAll(async ({ request }) => {
    // create NEW_CO
    const resp = await createNewCo(request, newCoInput)
    entities['NEW_CO'] = resp.newCo
    concept = resp.concept
    theme = resp.theme

    // create OP_CO
    const resp2 = await createCompany(request, opCoInput)
    expect(resp2.status()).toBe(201)
    entities['OP_CO'] = await resp2.json()

    // create member
    const resp3 = await createPerson(request, personInput)
    expect(resp3.status()).toBe(201)
    person = await resp3.json()

    // add member to companies
    const resp5 = await addMemberToCompany(
      request,
      entities['NEW_CO'].id,
      person.email
    )
    expect(resp5.status()).toBe(200)
    const resp6 = await addMemberToCompany(
      request,
      entities['OP_CO'].id,
      person.email
    )
    expect(resp6.status()).toBe(200)

    // check membership status
    expect(
      await getCompanyMemberStatus(request, entities['NEW_CO'].id, person.email)
    ).toBe('ACTIVE')
    expect(
      await getCompanyMemberStatus(request, entities['OP_CO'].id, person.email)
    ).toBe('ACTIVE')
  })

  test.afterAll(async ({ request }) => {
    await deleteCompany(request, entities['NEW_CO'].id)
    await deleteCompany(request, concept.id)
    await deleteCompany(request, theme.id)
    await deleteCompany(request, entities['OP_CO'].id)
    await deletePerson(request, person.email)
  })

  for (const stage of ['NEW_CO', 'OP_CO']) {
    const TEST_CASES = {
      Archived: { entityStatus: 'ARCHIVED', memberStatus: 'INACTIVE' },
      Active: { entityStatus: 'ACTIVE', memberStatus: 'INACTIVE' },
      Paused: { entityStatus: 'PAUSED', memberStatus: 'INACTIVE' },
      ResetActive: { entityStatus: 'ACTIVE', memberStatus: 'INACTIVE' },
      ReresetActive: { entityStatus: 'ACTIVE', memberStatus: 'ACTIVE' }
    }
    for (const tc of Object.keys(TEST_CASES)) {
      const entityStatus = TEST_CASES[tc].entityStatus
      const memberStatus = TEST_CASES[tc].memberStatus
      test(`Set ${stage} to "${tc}"`, async ({ request }) => {
        const e = entities[stage]
        const input = {
          name: e.name,
          status: entityStatus
        }
        if (e.stage == 'NEW_CO') {
          input['linkedApiId'] = e.linkedApiId
        }
        const resp = await updateCompany(request, e.id, input)
        const json = await resp.json()
        expect(resp.status()).toBe(200)

        // confirm entity status
        const resp2 = await getCompany(request, e.id)
        await expect(resp2.status()).toBe(200)
        const json2 = await resp2.json()
        expect(json.status).toBe(entityStatus)

        // check member status
        expect(await getCompanyMemberStatus(request, e.id, person.email)).toBe(
          memberStatus
        )

        // reset member status to 'ACTIVE' if entity status is now 'ACTIVE'
        if (entityStatus == 'ACTIVE') {
          const resp = await addMemberToCompany(
            request,
            e.id,
            person.email,
            'ACTIVE'
          )
          expect(resp.status()).toBe(200)
          expect(
            await getCompanyMemberStatus(request, e.id, person.email)
          ).toBe('ACTIVE')
        }
      })
    }
  }
})
