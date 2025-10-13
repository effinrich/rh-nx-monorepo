import { APIRequestContext, expect } from '@playwright/test'
import { portalTest } from '../../../../../../fixtures/platform-ui-test'
import {
  deleteCompany,
  testCompanyGenerator,
  newAPIContext
} from '../../../../../../utils/platform/company'
import { fakeCallNoteData } from '../../../../../../data/platform/call-note'
import {
  deleteNote,
  filterNotes
} from '../../../../../../utils/platform/callNotes'
import path from 'path'

/**
 * Setup:
 *  - Create an OpCo to use for the new call notes
 * Test:
 *  1. Add new call notes with attachments & verify data persistence
 *  2. Add new call notes without an attachment & verify data persistence
 * Teardown:
 *  - Delete call notes
 *  - Delete OpCo
 */
const attachments = {
  file1: {
    href: path.join(__dirname, 'uploadFiles', 'file1.png'),
    name: 'file1.png'
  },
  file2: {
    href: path.join(__dirname, 'uploadFiles', 'file2.txt'),
    name: 'file2.txt'
  }
}
const disclaimerText =
  'Attachment disclaimerBy checking this box, I confirm that I possess all ' +
  'necessary rights, licenses, and permissions for any material or content ' +
  'that I upload to ' +
  'the Platform. The uploaded material does not infringe upon the intellectual' +
  ' property rights, including but not limited to copyrights, trademarks, or ' +
  'patents, of any third party. I confirm'
let isLocalhost: boolean = false

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Call Notes', () => {
  let apiContext: APIRequestContext
  let opCo: CompanySummary
  let note: CallNoteSummary

  portalTest.beforeEach(async ({ signInRHUser, researchHub }, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    if (testInfo.config.metadata.apiURL.includes('localhost')) {
      isLocalhost = true
    }

    const id = Date.now() + Math.floor(Math.random() * 99999)
    opCo = await testCompanyGenerator(apiContext, {
      name: `Test: Add Call notes ${id}`
    })

    await researchHub.goto()
    await researchHub.callNotesTabBtn.click()
    await researchHub.openAddCallNotesForm()
  })

  portalTest.afterEach(async () => {
    await deleteNote(apiContext, note.id)
    await deleteCompany(apiContext, opCo.id)
    await apiContext.dispose()
  })

  async function checkDataPersistence(expected, opcoName) {
    // check data persistence
    let filterMap = new Map<string, string[]>([['companies', [opcoName]]])
    note = note
    await expect(async () => {
      const resp = await filterNotes(apiContext, filterMap)
      await expect(resp.status()).toBe(200)
      const json = await resp.json()
      expect(json.content.length).toBe(1)
      note = json.content[0]
    }).toPass({
      intervals: [2_000, 1_000, 500, 500, 250, 100]
    })

    expect.soft(note.intervieweeName).toBe(expected.intervieweeName)
    expect.soft(note.intervieweeCompany).toBe(expected.intervieweeCompany)
    expect.soft(note.intervieweeEmail).toBe(expected.intervieweeEmail)
    expect.soft(note.noteTaker).toBe('rhdevopstest3@gmail.com')
    expect.soft(note.type).toBe(expected.type)
    expect.soft(note.sourceOfInterview).toBe(expected.sourceOfInterview)
    expect.soft(note.companies[0].id).toBe(opCo.id)
    expect.soft(note.companies[0].name).toBe(opCo.name)
    expect.soft(note.companies[0].stage).toBe('OP_CO')
    expect.soft(note.linkedInProfileHref).toBe(expected.linkedInProfileHref)
    expect.soft(note.noteHref).toBe(expected.noteHref)
    expect.soft(note.stakeholders.sort()).toEqual(expected.stakeholders.sort())
    if (expected.attachments) {
      const actual = note.attachments.sort()
      const exp = expected.attachments.sort()
      for (let i = 0; i < actual.length; i++) {
        if (isLocalhost) {
          expect(actual[i].href).toBe('https://example.com')
        } else {
          const expectedhref = new RegExp(`${actual[i].href}$`)
          expect(actual[i].href).toMatch(expectedhref)
        }
        expect(actual['name']).toBe(exp.name)
      }
    }
  }

  portalTest.fixme(
    '1. Can add call note without attachment',
    async ({ researchHub }) => {
      const noteInput = fakeCallNoteData([opCo.id])
      noteInput['companyIds'] = [opCo.name]
      // attach then remove file to check that submit button is enabled
      noteInput['attachments'] = [attachments.file1]

      // add call note
      const form = researchHub.addCallNotesForm
      await form.fillout(noteInput)
      await form.removeAttachment(attachments.file1.name)
      await expect(form.disclaimer).not.toBeVisible()
      await form.submit()
      await expect(form.modal).not.toBeVisible()
      delete noteInput.attachments
      await checkDataPersistence(noteInput, opCo.name)
    }
  )

  portalTest.fixme(
    '2. Can add call note with attachment',
    async ({ researchHub }) => {
      // create fake input data
      const noteInput = fakeCallNoteData([opCo.id])
      noteInput['companyIds'] = [opCo.name]
      noteInput['attachments'] = [attachments.file1, attachments.file2]

      // add call note
      let form = researchHub.addCallNotesForm
      await form.fillout(noteInput)
      await expect(form.disclaimer).toBeVisible()
      await expect(form.disclaimer).toHaveText(disclaimerText)
      await expect(form.addCallNoteBtn).toBeDisabled()
      await form.acceptDisclaimer()
      await form.submit()
      await expect(form.modal).not.toBeVisible()
      await checkDataPersistence(noteInput, opCo.name)
    }
  )
})
