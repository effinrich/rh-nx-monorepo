import { expect, test } from '@playwright/test'
import {
  addMemberToCompany,
  createCompany,
  createNewCo,
  deleteCompany,
  updateCompany
} from '../../../../utils/platform/company'
import {
  createPerson,
  deletePerson,
  updatePersonRole
} from '../../../../utils/platform/person'
import {
  createResearch,
  deleteResearch
} from '../../../../utils/platform/research'
import { fakeResearchData } from '../../../../data/platform/research'
import { wait } from '../../../../utils/platform/utils'

/**
 * Setup:
 *  Create new OpCo user
 *  Create 2 OpCos not promoted from NewCo (MyOpCo & OpCo1)
 *  Create 1 NewCo (Theme1, Concept1, NewCo1), each with status PAUSED
 *  Create 1 OpCo promoted from NewCo (Theme2, Concept2, OpCo2) (still PAUSED)
 *  Set conflicts between MyOpCo all other entities
 *   - Theme1 & 2
 *   - Concept1 & 2
 *   - NewCo1
 *   - OpCo1 & 2
 *  Set Theme2, Concept2, & OpCo2 PAUSED
 *
 * Action:
 *  for each entity:
 *   - Theme1 & 2
 *   - Concept1 & 2
 *   - NewCo1
 *   - OpCo1
 *   - OpCo2
 *
 * 1. Add a research document associated with the entity
 *    (user is not yet a member of conflicting entity)
 *    - Check that the 'canAccess' is true
 * 2. Add user as member of MyCo (company in conflict with
 *    entity associated with the document)
 *    - Check that the 'canAccess' is false
 * 3. Set member INACTIVE in MyCo
 *    - Check that the 'canAccess' is true
 */
test.describe.configure({ mode: 'serial' })
test.describe('POST /research', () => {
  let myOpCo: CompanySummary
  let person: PersonSummary
  const id = Date.now() + 177614
  const ENTITIES = {}
  let researchIds = []

  test.beforeAll(async ({ request }) => {
    // create new user
    const resp1 = await createPerson(request, {
      email: `test-research_${id}@email.test`,
      familyName: `Test-research${id}`,
      givenName: `Test-research${id}`
    })
    expect(resp1.status()).toBe(201)
    person = await resp1.json()
    const roleResp = await updatePersonRole(
      request,
      person.email,
      'ROLE_OP_CO_USER'
    )
    expect(roleResp.status()).toBe(200)

    // create entities
    const resp2 = await createCompany(request, {
      name: `Test: research conflicts myOpCo ${id}`,
      number: id + 1
    })
    expect(resp2.status()).toBe(201)
    myOpCo = (await resp2.json()) as CompanySummary

    const resp3 = await createCompany(request, {
      name: `Test: research conflicts OpCo1 ${id}`,
      number: id + 2
    })
    expect(resp3.status()).toBe(201)
    ENTITIES['opCo1'] = (await resp3.json()) as CompanySummary

    const resp4 = await createNewCo(request, {
      name: `Test: research conflicts 1 ${id}`,
      number: id + 3
    })
    ENTITIES['theme1'] = resp4.theme
    ENTITIES['concept1'] = resp4.concept
    ENTITIES['newCo1'] = resp4.newCo

    const resp5 = await createNewCo(request, {
      name: `Test: research conflicts 2 ${id}`,
      number: id + 4,
      status: 'PAUSED'
    })
    ENTITIES['theme2'] = resp5.theme
    ENTITIES['concept2'] = resp5.concept
    const resp6 = await updateCompany(request, resp5.newCo.id, {
      name: resp5.newCo.name,
      stage: 'OP_CO',
      status: 'PAUSED',
      linkedApiId: resp5.newCo.linkedApiId
    })
    expect(resp6.status()).toBe(200)
    ENTITIES['opCo2'] = (await resp6.json()) as CompanySummary

    // set conflicts
    const resp7 = await request.put(`/company/${myOpCo.id}/conflicts`, {
      data: {
        conflicts: [
          ENTITIES['theme1'].id,
          ENTITIES['concept1'].id,
          ENTITIES['newCo1'].id,
          ENTITIES['theme2'].id,
          ENTITIES['concept2'].id,
          ENTITIES['opCo1'].id,
          ENTITIES['opCo2'].id
        ]
      }
    })
    expect(resp7.status()).toBe(200)
  })

  test.afterAll(async ({ request }) => {
    for (const r of researchIds) {
      const resp = await deleteResearch(request, r)
      expect(resp.status()).toBe(204)
    }
    let resp = await deletePerson(request, person.email)
    expect(resp.status()).toBe(204)
    for (const e of [
      myOpCo,
      ENTITIES['newCo1'],
      ENTITIES['opCo1'],
      ENTITIES['opCo2'],
      ENTITIES['concept1'],
      ENTITIES['concept2'],
      ENTITIES['theme1'],
      ENTITIES['theme2']
    ]) {
      resp = await deleteCompany(request, e.id)
    }
  })

  const TEST_CASES = [
    'opCo1',
    'theme1',
    'concept1',
    'newCo1',
    'theme2',
    'concept2',
    'opCo2'
  ]
  for (const idx in TEST_CASES) {
    test(`Check canAccess of ${TEST_CASES[idx]}`, async ({ request }) => {
      const entityKey = TEST_CASES[idx]
      const entity = ENTITIES[entityKey]
      // add research item
      const input = fakeResearchData(Date.now() + 177867 + idx, entity.id)
      input.authors = [person.email]
      const resp1 = await createResearch(request, input)
      expect(resp1.status()).toBe(201)
      const json1 = await resp1.json()
      researchIds.push(json1.id)
      await wait(1000)

      // check access when user is not a member of conflicting company
      const resp = await request.get(`/research?filter=entity,${entity.name}`, {
        headers: {
          'RH-Impersonation-Email': person.email
        }
      })
      expect(resp.status()).toBe(200)
      const json = await resp.json()
      expect(json.content.length).toEqual(1)
      expect(json.content[0].canAccess).toEqual(true)

      // add person to conflicting entity
      const resp2 = await addMemberToCompany(request, myOpCo.id, person.email)
      expect(resp2.status()).toBe(200)

      // check the 'canAccess' property (false)
      const resp3 = await request.get(
        `/research?filter=entity,${entity.name}`,
        {
          headers: {
            'RH-Impersonation-Email': person.email
          }
        }
      )
      expect(resp3.status()).toBe(200)
      const json3 = await resp3.json()
      expect(json3.content.length).toEqual(1)
      expect(json3.content[0].canAccess).toEqual(false)

      // set member INACTIVE
      const resp4 = await addMemberToCompany(
        request,
        myOpCo.id,
        person.email,
        'INACTIVE'
      )
      expect(resp4.status()).toBe(200)

      // check the 'canAccess' property (true)
      const resp5 = await request.get(
        `/research?filter=entity,${entity.name}`,
        {
          headers: {
            'RH-Impersonation-Email': person.email
          }
        }
      )
      expect(resp5.status()).toBe(200)
      const json5 = await resp5.json()
      expect(json5.content.length).toEqual(1)
      expect(json5.content[0].canAccess).toEqual(true)
    })
  }
})
