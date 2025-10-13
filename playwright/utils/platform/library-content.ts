import { APIRequestContext } from '@playwright/test/types/test'
import { convertSearchCommandToQueryParams } from './utils'

export async function createLibraryContent(
  apiContext: APIRequestContext,
  input: LibraryContentCommand
) {
  return await apiContext.post(`/library-content?page=0&size=99999`, {
    data: { ...input }
  })
}
export async function updateLibraryContent(
  apiContext: APIRequestContext,
  id: string,
  input: LibraryContentCommand
) {
  return await apiContext.put(`/library-content/${id}`, {
    data: { ...input }
  })
}

export async function getAllLibraryContent(apiContext: APIRequestContext) {
  return await apiContext.get('/library-content')
}

export async function getLibraryContent(
  apiContext: APIRequestContext,
  id: string
) {
  return await apiContext.get(`/library-content/${id}`)
}

export async function deleteLibraryContent(
  apiContext: APIRequestContext,
  id: string
) {
  return await apiContext.delete(`/library-content/${id}`)
}

export async function queryLibraryContent(
  apiContext: APIRequestContext,
  searchCommand: SearchCommand
) {
  const queryParams = searchCommand
    ? convertSearchCommandToQueryParams(searchCommand)
    : new URLSearchParams()
  return apiContext.get(`/library-content?${queryParams}`)
}

export async function moveLibraryContent(
  apiContext: APIRequestContext,
  parentId: string,
  childId: string
) {
  return apiContext.put(`/library-content/${parentId}/child/${childId}`)
}
