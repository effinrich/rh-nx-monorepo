import { APIRequestContext, expect } from '@playwright/test'
import { portalTest } from '../../../../../../fixtures/platform-ui-test'
import {
  deleteCompany,
  testCompanyGenerator,
  newAPIContext
} from '../../../../../../utils/platform/company'
import {
  deleteNote,
  testCallNoteGenerator,
  filterNotes
} from '../../../../../../utils/platform/callNotes'
import { DOC_BOWIE } from '../../../../../../data/platform/googleDocs'

/**
 * Setup:
 *  - Create an OpCo
 *  - Add a new note for the OpCo
 * Tests:
 * 1. Search by interviewee name
 * 2. Search by interviewee company
 * Expect:
 * 1. Specific card should be first found
 * Teardown:
 * - Delete call notes
 * - Delete OpCo
 */
portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Search Call Notes', () => {
  let apiContext: APIRequestContext
  let opco: CompanySummary
  let note: CallNoteSummary

  portalTest.beforeEach(async ({ signInRHUser, researchHub }, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )

    // create opco
    const id = Date.now() + Math.floor(Math.random() * 99999)
    opco = await testCompanyGenerator(apiContext, {
      name: `Test: Search Call notes ${id}`,
      number: id
    })

    note = await testCallNoteGenerator(apiContext, {
      companyIds: [opco.id],
      noteHref: DOC_BOWIE.href
    })
    // make sure note can be found
    await expect(async () => {
      let filterMap = new Map<string, string[]>([['companies', [opco.name]]])
      const resp = await filterNotes(apiContext, filterMap)
      await expect(resp.status()).toBe(200)
      const json = await resp.json()
      expect(json.content.length).toBe(1)
    }).toPass({
      intervals: [2_000, 1_000, 500, 500, 250, 100]
    })

    await researchHub.goto()
    await researchHub.callNotesTabBtn.click()
    await expect(researchHub.callNotesTab.loadingSpinner).not.toBeVisible()
  })

  portalTest.afterEach(async () => {
    await deleteNote(apiContext, note.id)
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  async function searchNotes(notestab, term) {
    await notestab.search(term)
    await expect(notestab.loadingSpinner).not.toBeVisible()
    expect.soft(await notestab.resultsCount()).toBeGreaterThanOrEqual(1)
    return await notestab.resultsCount()
  }

  portalTest.fixme('Search by Interviewee Name', async ({ researchHub }) => {
    await searchNotes(researchHub.callNotesTab, note.intervieweeName)
    const expectedString = `${note.intervieweeName} - ${note.intervieweeCompany}`
    const cards = await researchHub.callNotesTab.allCards()
    await expect(cards[0].title).toHaveText(expectedString)
  })

  portalTest.fixme('Search by Interviewee Company', async ({ researchHub }) => {
    await searchNotes(researchHub.callNotesTab, note.intervieweeCompany)
    const cards = await researchHub.callNotesTab.allCards()
    await expect(cards[0].title).toHaveText(
      `${note.intervieweeName} - ${note.intervieweeCompany}`
    )
  })

  portalTest.fixme('Search by note content @dev', async ({ researchHub }) => {
    const count = await searchNotes(
      researchHub.callNotesTab,
      DOC_BOWIE.searchTerm
    )
    // all cards should match search term
    const regex = new RegExp(DOC_BOWIE.searchTerm)
    const expected = [...new Array(count)].map(() => regex)
    await expect(researchHub.callNotesTab.allCardSearchMatches).toHaveText(
      expected
    )
  })
})
