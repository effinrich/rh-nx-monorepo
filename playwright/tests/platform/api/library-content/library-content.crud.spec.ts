import { expect, test } from '@playwright/test'
import { wait } from '../../../../utils/platform/utils'
import { createLibrary } from '../../../../utils/platform/library'
import {
  createLibraryContent,
  deleteLibraryContent,
  getLibraryContent,
  moveLibraryContent,
  queryLibraryContent,
  updateLibraryContent
} from '../../../../utils/platform/library-content'

test.describe('Library Content CRUD', () => {
  let library: LibrarySummary
  test.beforeEach(async ({ request }, testInfo) => {
    const res = await createLibrary(request, {
      displayName: testInfo.title
    })
    expect(res.status()).toEqual(201)
    library = (await res.json()) as LibrarySummary
  })

  test.describe('Operations', () => {
    let category: LibraryContentSummary

    test.beforeEach(async ({ request }, testInfo) => {
      const res = await createLibraryContent(request, {
        title: testInfo.title,
        description: 'Information about running a company',
        type: 'CATEGORY',
        libraryId: library.id
      })

      expect(res.status()).toEqual(201)
      category = (await res.json()) as LibraryContentSummary
    })

    test.afterEach(async ({ request }) => {
      const res = await deleteLibraryContent(request, category.id)
      expect(res.status()).toEqual(204)
    })

    test.describe('Can retrieve content', () => {
      test('Success', async ({ request }) => {
        const res = await getLibraryContent(request, category.id)

        expect.soft(res.status()).toEqual(200)
        expect(await res.json()).toEqual(
          expect.objectContaining({
            id: category.id,
            title: category.title,
            description: category.description,
            type: {
              displayName: 'Category',
              value: 'CATEGORY'
            }
          })
        )
      })
      test('Not found', async ({ request }) => {
        const res = await getLibraryContent(request, 'unknown')
        expect.soft(res.status()).toEqual(404)
        expect(await res.json()).toEqual(
          expect.objectContaining({
            message: 'Content does not exist.'
          })
        )
      })
    })

    test.describe('Can query content', () => {
      test('Able to use ?q for full-text search', async ({ request }) => {
        await wait(2000)
        const res = await queryLibraryContent(request, {
          q: category.title,
          filters: [['libraryId', library.id]]
        })

        expect.soft(res.status()).toEqual(200)
        expect((await res.json()).content).toContainEqual(
          expect.objectContaining({
            id: category.id
          })
        )
      })

      test('Can filter with ?filter', async ({ request }) => {
        await wait(2000)
        const res = await queryLibraryContent(request, {
          filters: [
            ['libraryId', library.id],
            ['type', 'CATEGORY']
          ]
        })

        expect.soft(res.status()).toEqual(200)
        expect((await res.json()).content).toContainEqual(
          expect.objectContaining({
            id: category.id
          })
        )
      })
    })
    test.describe('Can update content', () => {
      test('Success', async ({ request }) => {
        const res = await updateLibraryContent(request, category.id, {
          title: 'Performance Framework',
          type: 'ARTICLE',
          libraryId: library.id
        })

        expect.soft(res.status()).toEqual(200)
        expect(await res.json()).toEqual(
          expect.objectContaining({
            title: 'Performance Framework',
            type: {
              displayName: 'Article',
              value: 'ARTICLE'
            }
          })
        )
      })

      test('Not found', async ({ request }) => {
        const res = await updateLibraryContent(request, 'unknown', {
          title: 'Performance Framework',
          type: 'ARTICLE',
          libraryId: library.id
        })
        expect.soft(res.status()).toEqual(404)

        expect(await res.json()).toEqual(
          expect.objectContaining({
            message: 'Content does not exist.'
          })
        )
      })

      test('Cannot set parent to itself', async ({ request }) => {
        const res = await updateLibraryContent(request, category.id, {
          title: 'Performance Framework',
          type: 'ARTICLE',
          libraryId: library.id,
          parentId: category.id
        })
        expect.soft(res.status()).toBe(422)
        const error = await res.json()
        expect(error).toEqual(
          expect.objectContaining({
            message: 'Invalid field values',
            errors: [
              {
                name: 'parentId',
                rejectedValue: category.id,
                description: 'must not reference itself'
              }
            ]
          })
        )
      })
    })

    test.describe('Can move content', () => {
      let child: LibraryContentSummary
      test.beforeEach(async ({ request }) => {
        const res = await createLibraryContent(request, {
          title: 'Performance Framework',
          type: 'ARTICLE',
          libraryId: library.id
        })
        expect.soft(res.status()).toEqual(201)
        child = (await res.json()) as LibraryContentSummary
        expect(child.parentId).toBeUndefined()
      })

      test.afterEach(async ({ request }) => {
        const res = await deleteLibraryContent(request, child.id)
        expect(res.status()).toEqual(204)
      })

      test('Cannot set parent to itself', async ({ request }) => {
        const res = await moveLibraryContent(request, child.id, child.id)
        expect(res.status()).toBe(422)
        expect(await res.json()).toEqual(
          expect.objectContaining({
            message: 'Invalid field values',
            errors: [
              {
                name: 'parentId',
                rejectedValue: child.id,
                description: 'must not reference itself'
              }
            ]
          })
        )
      })
      test('Success', async ({ request }) => {
        // attach child to parent
        let res = await moveLibraryContent(request, category.id, child.id)

        expect(res.status()).toEqual(204)

        // verify
        res = await getLibraryContent(request, child.id)
        expect.soft(res.status()).toEqual(200)
        const updatedChild = (await res.json()) as LibraryContentSummary
        expect.soft(updatedChild.parentId).toEqual(category.id)
      })
    })
  })
})
