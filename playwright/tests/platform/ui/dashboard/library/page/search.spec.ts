import { expect } from '@playwright/test'
import { getAllLibraryContent } from '../../../../../../utils/platform/library-content'
import { newAPIContext } from '../../../../../../utils/platform/company'
import { portalTest } from '../../../../../../fixtures/platform-ui-test'

portalTest.describe('Search Library Content', async () => {
  let apiContext
  let googleDoc
  let searchTerm

  portalTest.beforeAll(async ({}, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    const allContent = await getAllLibraryContent(apiContext)
    const json = await allContent.json()

    const googleContent = []
    const eklContent = []
    for (const contentItem of json.content) {
      if (contentItem.remoteContentSource?.value === 'GOOGLE_DRIVE') {
        googleContent.push(contentItem)
      } else if (contentItem.remoteContentSource?.value === 'MKDOCS') {
        eklContent.push(contentItem)
      }
    }
    // pick a search term from a random Google doc
    googleDoc = googleContent[Math.floor(Math.random() * googleContent.length)]
    const words = googleDoc.title.split(' ')
    const searchTerms = words.filter(word => word.length > 4)
    searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]
  })

  portalTest.afterAll(async () => {
    await apiContext.dispose()
  })

  portalTest.skip(
    'Company User can search the Library',
    async ({ signInCoUser, library }) => {
      await library.goto()
      await library.search(searchTerm)
      await expect(library.searchbox.optionsLB).toContainText(googleDoc.title)
    }
  )
})
