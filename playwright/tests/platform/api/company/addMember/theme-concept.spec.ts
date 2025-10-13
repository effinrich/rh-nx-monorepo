import { expect, test } from '@playwright/test'
import {
  addMemberToCompany,
  createCompany,
  deleteCompany
} from '../../../../../utils/platform/company'
import {
  createPerson,
  deletePerson
} from '../../../../../utils/platform/person'

/**
 * Testing that we cannot add members to Theme or Concept,
 * regardless of the status of the user or the entity
 */
test.describe.configure({ mode: 'serial' })
test.describe('Company Member CRUD', () => {
  let entities = {}
  let person: PersonSummary

  test.beforeAll(async ({ request }) => {
    const entityInput = {
      theme1: { stage: 'THEME', status: 'ACTIVE' },
      theme2: { stage: 'THEME', status: 'ARCHIVED' },
      theme3: { stage: 'THEME', status: 'PAUSED' },
      concept1: { stage: 'CONCEPT', status: 'ACTIVE' },
      concept2: { stage: 'CONCEPT', status: 'ARCHIVED' },
      concept3: { stage: 'CONCEPT', status: 'PAUSED' }
    }
    const now = Date.now()
    let i = 0
    for (const e of Object.keys(entityInput)) {
      const stage = entityInput[e].stage
      const status = entityInput[e].status
      const input = {
        name: `Test: cannot add member to ${status} ${stage}`,
        number: now + i++,
        stage: stage,
        status: status
      }
      const resp = await createCompany(request, input)
      const json = await resp.json()
      expect(resp.status()).toBe(201)
      entities[e] = json
    }

    // create user
    const personInput = {
      givenName: `Test fn_${now}`,
      familyName: `Test ln_${now}`,
      email: `test_${now}@redesignhealth.com`
    }
    const resp = await createPerson(request, personInput)
    expect(resp.status()).toBe(201)
    person = await resp.json()
  })

  test.afterAll(async ({ request }) => {
    for (const e of Object.keys(entities)) {
      await deleteCompany(request, entities[e].id)
    }
    await deletePerson(request, person.email)
  })

  const TEST_CASES = [
    { memberStatus: 'INACTIVE', entity: 'theme1' },
    { memberStatus: 'INACTIVE', entity: 'theme2' },
    { memberStatus: 'INACTIVE', entity: 'theme3' },
    { memberStatus: 'ACTIVE', entity: 'theme1' },
    { memberStatus: 'ACTIVE', entity: 'theme2' },
    { memberStatus: 'ACTIVE', entity: 'theme3' },
    { memberStatus: 'INACTIVE', entity: 'concept1' },
    { memberStatus: 'INACTIVE', entity: 'concept2' },
    { memberStatus: 'INACTIVE', entity: 'concept3' },
    { memberStatus: 'ACTIVE', entity: 'concept1' },
    { memberStatus: 'ACTIVE', entity: 'concept2' },
    { memberStatus: 'ACTIVE', entity: 'concept3' }
  ]

  for (const tc of TEST_CASES) {
    test(`Cannot add ${tc.memberStatus} member to ${tc.entity}`, async ({
      request
    }) => {
      const resp = await addMemberToCompany(
        request,
        entities[tc.entity].id,
        person.email,
        tc.memberStatus
      )
      expect(resp.status()).toBe(403)
      const json = await resp.json()
      expect(json.message).toBe('Stage must be OP_CO or NEW_CO to add members')
    })
  }
})
