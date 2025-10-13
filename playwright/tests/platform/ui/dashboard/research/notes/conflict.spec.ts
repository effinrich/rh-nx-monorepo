import { APIRequestContext, expect } from '@playwright/test'
import { portalTest } from '../../../../../../fixtures/platform-ui-test'
import {
  addMemberToCompany,
  deleteCompany,
  testCompanyGenerator,
  newAPIContext
} from '../../../../../../utils/platform/company'
import {
  deleteNote,
  testCallNoteGenerator,
  filterNotes
} from '../../../../../../utils/platform/callNotes'
import { impersonate } from '../../../../../../utils/platform/utils'
import { SLIDE_NORWID } from '../../../../../../data/platform/googleDocs'
import {
  deletePerson,
  testPersonGenerator
} from '../../../../../../utils/platform/person'
import { ROLES } from '../../../../../../data/platform/users'
import { filterNotes as filter } from './helpers'

/**
 * Setup:
 *  - Create an OpCo
 *  - Create a Theme
 *  - Set Theme & OpCo in conflict
 *  - Create new user with RH User role
 *  - Add user to OpCo
 *  - Create new note tied to Theme
 * Test:
 *  - Filter by theme name
 * Expect:
 * 1. Card should be found
 * 2. Card should have conflict message
 * Future Tests when functionality is available
 * -  Toggle to hide conflicted content
 * - Expect to see 'No call notes found' message
 * Teardown:
 * - Delete call notes
 * - Delete OpCo
 * - Delete Theme
 * - Delete user
 */

portalTest.describe('Search Call Notes', () => {
  let apiContext: APIRequestContext
  let opco: CompanySummary
  let theme: CompanySummary
  let person: PersonSummary
  let notes: CallNoteSummary

  portalTest.beforeEach(async ({ researchHub }, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )

    // create entities
    const id1 = Date.now() + Math.floor(Math.random() * 99999)
    opco = await testCompanyGenerator(apiContext, {
      name: `Test: Search Call notes ${id1}`,
      number: id1
    })

    const id2 = Date.now() + Math.floor(Math.random() * 99999)
    theme = await testCompanyGenerator(apiContext, {
      name: `Test: Search Call notes ${id2}`,
      number: id2,
      stage: 'THEME'
    })

    let resp = await apiContext.put(`/company/${opco.id}/conflicts`, {
      data: {
        conflicts: [theme.id]
      }
    })
    expect(resp.status()).toBe(200)

    person = await testPersonGenerator(apiContext, {
      role: ROLES.rhUser.authority
    })

    resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)

    notes = await testCallNoteGenerator(apiContext, {
      companyIds: [theme.id],
      noteHref: SLIDE_NORWID.href
    })

    // ensure notes are available
    await expect(async () => {
      let filterMap = new Map<string, string[]>([['companies', [theme.name]]])
      const resp = await filterNotes(apiContext, filterMap)
      await expect(resp.status()).toBe(200)
      const json = await resp.json()
      expect(json.content.length).toBeGreaterThanOrEqual(1)
    }).toPass({
      intervals: [3_000, 2_000, 1_000],
      timeout: 18_000
    })

    await researchHub.goto()
    await impersonate(researchHub, person)
    await researchHub.callNotesTabBtn.click()
    await expect(researchHub.callNotesTab.loadingSpinner).not.toBeVisible()
  })

  portalTest.afterAll(async () => {
    await deleteNote(apiContext, notes.id)
    await deletePerson(apiContext, person.email)
    await deleteCompany(apiContext, opco.id)
    await deleteCompany(apiContext, theme.id)
    await apiContext.dispose()
  })

  portalTest.fixme(
    'Search with conflicted content',
    async ({ researchHub }) => {
      await filter(researchHub.callNotesTab, 'Entity', theme.name)
      // const expected = new RegExp(theme.name)
      const callNotesCards = await researchHub.callNotesTab.allCards()
      const firstCard = callNotesCards[0]
      await expect.soft(firstCard.entityName).toHaveText(theme.name)
      await expect(firstCard.readNotesBtn).not.toBeVisible()
      await expect(firstCard.header).toHaveText(/.*Conflict of interest/)
    }
  )
})
