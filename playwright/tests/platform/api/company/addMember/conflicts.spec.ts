import { expect, test } from '@playwright/test'
import {
  addMemberToCompany,
  createCompany,
  createNewCo,
  deleteCompany,
  removeMemberFromCompany,
  updateCompany
} from '../../../../../utils/platform/company'
import {
  createPerson,
  deletePerson,
  updatePersonRole
} from '../../../../../utils/platform/person'

/**
 * TEST SUMMARY:
 * EntityA conflicts with EntityB, which conflicts with EntityC
 * Therefore, no users should be added to EntityA if they are
 * active with EntityB and no users should be added to EntityB
 * if they are active with EntityA
 *
 * ENTITIES:
 * EntityA = OpCo
 * EntityB = NewCo
 * EntityC = OpCo promoted from NewCo
 *
 * EntityA has a conflict with EntityB
 * EntityB has a conflict with EntityC
 *
 * MEMBERS:
 * Member1 = RH User, Active with EntityB
 * Member2 = RH User, Active with EntityC
 * Member3 = RH User, Inactive with EntityB
 * Member4 = Co User, Active with EntityB
 * Member5 = Co User, Active with EntityC
 * Member6 = Co User, Inactive with EntityC
 *
 * EXPECT:
 * Part 1
 * Members 1 & 4, shall be blocked from being added to EntityA
 * Members 2, 3, 5 & 6 shall be added to EntityA
 * (Remove members 2, 3, 5 & 6 from EntityA before proceeding)
 *
 * Part 2
 * Members 2 & 5 shall be blocked from being added to EntityB
 * Member 6 shall be added to EntityB
 * Remove members 6 from EntityB before proceeding)
 *
 * Part 3
 * Members 1 & 4 shall be blocked from being added to EntityC
 * Member 3 shall be added to EntityC
 */
let entityA: CompanySummary
let entityB: CompanySummary
let entityC: CompanySummary

let newCoB, newCoC // to store theme, concept, & newCo data

const personInput = [
  {
    givenName: 'Member1',
    familyName: 'Conflict1',
    email: 'conflict1@email.test',
    role: 'ROLE_RH_USER'
  },
  {
    givenName: 'Member2',
    familyName: 'Conflict2',
    email: 'conflict2@email.test',
    role: 'ROLE_RH_USER'
  },
  {
    givenName: 'Member3',
    familyName: 'Conflict3',
    email: 'conflict3@email.test',
    role: 'ROLE_RH_USER'
  },
  {
    givenName: 'Member4',
    familyName: 'Conflict4',
    email: 'conflict4@email.test',
    role: 'ROLE_OP_CO_USER'
  },
  {
    givenName: 'Member5',
    familyName: 'Conflict5',
    email: 'conflict5@email.test',
    role: 'ROLE_OP_CO_USER'
  },
  {
    givenName: 'Member6',
    familyName: 'Conflict6',
    email: 'conflict6@email.test',
    role: 'ROLE_OP_CO_USER'
  }
]
test.describe('Add Member with Conflicts', async () => {
  test.describe.configure({ mode: 'serial' })
  test.setTimeout(300000)
  test.beforeAll(async ({ request }) => {
    test.setTimeout(60000)
    // create entities
    const resp1 = await createCompany(request, {
      name: 'Test: Conflicts - entityA',
      number: 1687812016,
      stage: 'OP_CO'
    })
    expect(resp1.status()).toBe(201)
    entityA = await resp1.json()

    newCoB = await createNewCo(request, {
      name: 'Test: Conflicts - entityB',
      number: 1687812017
    })
    entityB = newCoB.newCo

    newCoC = await createNewCo(request, {
      name: 'Test: Conflicts - entityC',
      number: 1687812018
    })
    entityC = newCoC.newCo

    // promote entityC
    const resp2 = await updateCompany(request, entityC.id, {
      name: entityC.name + ' > OpCo',
      stage: 'OP_CO',
      linkedApiId: entityC.linkedApiId
    })
    expect(resp2.status()).toBe(200)
    entityC = await resp2.json()

    // create members
    for (const m of personInput) {
      const resp1 = await createPerson(request, {
        givenName: m.givenName,
        familyName: m.familyName,
        email: m.email
      })
      expect(resp1.status()).toBe(201)
      const json = await resp1.json()

      // add member roles
      const resp2 = await updatePersonRole(request, m.email, m.role)
      expect(resp2.status()).toBe(200)
    }

    const memberInput = [
      { member: personInput[0].email, company: entityB.id, status: 'ACTIVE' },
      { member: personInput[1].email, company: entityC.id, status: 'ACTIVE' },
      { member: personInput[2].email, company: entityB.id, status: 'INACTIVE' },
      { member: personInput[3].email, company: entityB.id, status: 'ACTIVE' },
      { member: personInput[4].email, company: entityC.id, status: 'ACTIVE' },
      { member: personInput[5].email, company: entityC.id, status: 'INACTIVE' }
    ]
    // add members to companies
    for (const m of memberInput) {
      const resp = await addMemberToCompany(
        request,
        m.company,
        m.member,
        m.status
      )
      let json
      try {
        json = await resp.json()
      } catch (e) {
        await console.log('caught an error adding a member to a company:', e)
      }
      expect(resp.status(), json).toBe(200)
    }

    // add conflicts
    let resp3 = await request.put(`/company/${entityA.id}/conflicts`, {
      data: {
        conflicts: [entityB.id]
      }
    })
    expect(resp3.status()).toBe(200)
    let resp4 = await request.put(`/company/${entityB.id}/conflicts`, {
      data: {
        conflicts: [entityC.id]
      }
    })
    expect(resp4.status()).toBe(200)
  })

  test.afterAll(async ({ request }, testInfo) => {
    // delete companies
    const entityIds = [
      entityA.id,
      entityB.id,
      newCoB.concept.id,
      newCoB.theme.id,
      entityC.id,
      newCoC.concept.id,
      newCoC.theme.id
    ]
    for (const id of entityIds) {
      const resp = await deleteCompany(request, id)
      expect.soft(resp.status()).toBe(204)
    }

    // delete members
    for (const m of personInput) {
      const resp2 = await deletePerson(request, m.email)
      expect.soft(resp2.status()).toBe(204)
    }
  })

  // PART 1
  for (const m of [personInput[0], personInput[3]]) {
    test(`Cannot add ${m.givenName} to EntityA`, async ({ request }) => {
      const resp = await addMemberToCompany(
        request,
        entityA.id,
        m.email,
        'ACTIVE'
      )
      expect(resp.status()).toBe(403)
      const json = await resp.json()
      expect.soft(json.error).toBe('Forbidden')
      expect(json.message).toBe(
        `The person ${m.email} belongs to a company in conflict with this company ${entityA.name}`
      )
    })
  }

  for (const m of [
    personInput[1],
    personInput[2],
    personInput[4],
    personInput[5]
  ]) {
    test(`Can add ${m.givenName} to EntityA - `, async ({ request }) => {
      const resp = await addMemberToCompany(
        request,
        entityA.id,
        m.email,
        'ACTIVE'
      )
      expect(resp.status()).toBe(200)

      // remove members / clean up for next test
      const resp2 = await removeMemberFromCompany(request, entityA.id, m.email)
      expect(resp.status()).toBe(200)
    })
  }

  // PART 2
  for (const m of [personInput[1], personInput[4]]) {
    test(`Cannot add ${m.givenName} to EntityB`, async ({ request }) => {
      const resp = await addMemberToCompany(
        request,
        entityB.id,
        m.email,
        'ACTIVE'
      )
      expect(resp.status()).toBe(403)
      const json = await resp.json()
      expect.soft(json.error).toBe('Forbidden')
      expect(json.message).toBe(
        `The person ${m.email} belongs to a company in conflict with this company ${entityB.name}`
      )
    })
  }

  test(`Can add Member6 to EntityB`, async ({ request }) => {
    const resp = await addMemberToCompany(
      request,
      entityB.id,
      personInput[5].email,
      'ACTIVE'
    )
    expect(resp.status()).toBe(200)

    // remove member / clean up for next test
    const resp2 = await removeMemberFromCompany(
      request,
      entityB.id,
      personInput[5].email
    )
    expect(resp.status()).toBe(200)
  })

  // PART 3
  for (const m of [personInput[0], personInput[3]]) {
    test(`Cannot add ${m.givenName} to EntityC`, async ({ request }) => {
      const resp = await addMemberToCompany(
        request,
        entityC.id,
        m.email,
        'ACTIVE'
      )
      expect(resp.status()).toBe(403)
      const json = await resp.json()
      expect.soft(json.error).toBe('Forbidden')
      expect(json.message).toBe(
        `The person ${m.email} belongs to a company in conflict with this company ${entityC.name}`
      )
    })
  }

  test(`Can add Member3 to EntityC`, async ({ request }) => {
    const resp = await addMemberToCompany(
      request,
      entityC.id,
      personInput[2].email,
      'ACTIVE'
    )
    expect(resp.status()).toBe(200)
  })
})
