import { APIRequestContext } from '@playwright/test/types/test'
import { convertSearchCommandToQueryParams } from './utils'

export async function createLibrary(
  apiContext: APIRequestContext,
  input: LibraryCommand
) {
  return await apiContext.post(`/library`, {
    data: { ...input }
  })
}

export async function deleteLibrary(
  apiContext: APIRequestContext,
  libraryId: string
) {
  return await apiContext.delete(`/library/${libraryId}`)
}

export async function getLibrary(
  apiContext: APIRequestContext,
  libraryId: string,
  impersonate?: string
) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  return await apiContext.get(`/library/${libraryId}`, config)
}

export async function getDocumentsFromLibraryWithoutQuery(
  apiContext: APIRequestContext,
  libraryId: string
) {
  return await apiContext.get(`/library/${libraryId}/content`)
}

export async function queryLibraryContent(
  apiContext: APIRequestContext,
  libraryId: string,
  searchCommand?: SearchCommand
) {
  const queryParams = searchCommand
    ? convertSearchCommandToQueryParams(searchCommand)
    : new URLSearchParams()
  return await apiContext.get(`/library/${libraryId}/content?${queryParams}`)
}
