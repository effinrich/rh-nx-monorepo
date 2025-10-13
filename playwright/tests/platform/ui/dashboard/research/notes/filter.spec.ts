import { APIRequestContext, expect } from '@playwright/test'
import { portalTest } from '../../../../../../fixtures/platform-ui-test'
import {
  createCompany,
  deleteCompany,
  newAPIContext
} from '../../../../../../utils/platform/company'
import { fakeCallNoteData } from '../../../../../../data/platform/call-note'
import {
  deleteNote,
  getNoteFilters
} from '../../../../../../utils/platform/callNotes'
import { createNotes } from '../../../../../../utils/platform/callNotes'
import { randomTaxonomy } from '../../../../../../data/platform/company-taxonomy'
import { faker } from '@faker-js/faker'
import { filterNotes } from './helpers'

/**
 * Setup:
 *  - Create an OpCo
 *  - Create new note tied to OpCo with values for each filter
 * Tests:
 * 1. Filter by note taker
 * 2. Filter by company
 * 3. Filter by tags
 * 4. Filter by stakeholders
 * 5. Filter by taxonomy
 * Expect:
 * 1. At least 1 card should be found
 * 2. All cards should match the filter criteria
 * Teardown:
 * - Delete call notes
 * - Delete OpCo
 */
portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Filter Call Notes', () => {
  let apiContext: APIRequestContext
  let opco: CompanySummary
  let note: CallNoteSummary
  let noteInput: CallNoteCommand
  let taxonomy = []

  portalTest.beforeEach(async ({ signInRHUser, researchHub }, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )

    // create opco
    const id = Date.now() + Math.floor(Math.random() * 99999)
    taxonomy = randomTaxonomy()
    let resp = await createCompany(apiContext, {
      name: `Test: Filter Call notes ${id}`,
      number: id,
      taxonomy: taxonomy[2].key
    })
    expect(resp.status()).toBe(201)
    opco = (await resp.json()) as CompanySummary

    noteInput = fakeCallNoteData()
    noteInput.companyIds = [opco.id]

    resp = await createNotes(apiContext, noteInput)
    expect(resp.status()).toBe(201)
    note = await resp.json()

    // ensure filters are updated
    await expect(async () => {
      let resp = await getNoteFilters(apiContext)
      let json = await resp.json()
      let coKey = json.content.findIndex(f => f.key === 'companies')
      let ans = json.content[coKey].options.some(o => o.keyword === opco.name)
      expect(ans).toBeTruthy()
    }).toPass({
      intervals: [7_000, 1_000, 500, 500, 250, 100]
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

  portalTest.fixme('Filter by Stakeholder', async ({ researchHub }) => {
    const stakeholderFilter = faker.helpers.arrayElement(noteInput.stakeholders)
    await filterNotes(
      researchHub.callNotesTab,
      'Stakeholders',
      stakeholderFilter
    )
    for (const sh of await researchHub.callNotesTab.allCardStakeholders.all()) {
      await expect(
        (await sh.textContent()).indexOf(stakeholderFilter)
      ).toBeGreaterThanOrEqual(0)
    }
  })

  portalTest.fixme('Filter by Tag', async ({ researchHub }) => {
    const tagFilter = faker.helpers.arrayElement(noteInput.additionalTags)
    await filterNotes(researchHub.callNotesTab, 'Tags', tagFilter)
    for (const tags of await researchHub.callNotesTab.allCardAdditionalTags.all()) {
      await expect(
        (await tags.textContent()).indexOf(tagFilter)
      ).toBeGreaterThanOrEqual(0)
    }
  })

  portalTest.fixme(
    'Filter by Author @fixme',
    async ({ researchHub }, testInfo) => {
      // note: impersontated user not stored as author
      testInfo.annotations.push({
        type: 'known issue - Call notes author is incorrect when impersonating',
        description: 'https://redesignhealth.atlassian.net/browse/PUD-737'
      })
      const noteTaker = 'rhdevopstest3@gmail.com'
      let count = await filterNotes(
        researchHub.callNotesTab,
        'Authors',
        noteTaker
      )
      count = count > 50 ? 50 : count
      const regex = new RegExp(`^${noteTaker}, \\d{2}/\\d{2}/\\d{4}`)
      const expected = [...new Array(count)].map(() => regex)
      await expect
        .soft(researchHub.callNotesTab.allCardSubheadings)
        .toHaveText(expected)
    }
  )

  portalTest.fixme('Filter by Entity', async ({ researchHub }) => {
    await filterNotes(researchHub.callNotesTab, 'Entity', opco.name)
    const expected = new RegExp(opco.name)
    await expect(researchHub.callNotesTab.allCardEntityNames).toHaveText(
      expected
    )
  })

  portalTest.fixme(
    'Filter by Taxonomy @fixme',
    async ({ researchHub }, testInfo) => {
      testInfo.annotations.push({
        type: 'known issue: Taxonomy filter does not return any results',
        description: 'https://redesignhealth.atlassian.net/browse/PUD-706'
      })
      const taxonomyFilter = faker.helpers.arrayElement(taxonomy)
      await filterNotes(
        researchHub.callNotesTab,
        'Taxonomy',
        taxonomyFilter.value
      )
      portalTest.fail()
      const cards = await researchHub.callNotesTab.allCards()
      for (const card of cards) {
        await card.showMoreBtn.click()
        const actual = await card.taxonomy.textContent()
        console.log('taxonomy:', actual)
        expect(actual.indexOf(taxonomyFilter.value)).toBeGreaterThanOrEqual(0)
      }
    }
  )
})
