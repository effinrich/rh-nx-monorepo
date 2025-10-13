import { APIRequestContext } from '@playwright/test/types/test'
import { convertSearchCommandToQueryParams } from './utils'

export async function createResearch(
  apiContext: APIRequestContext,
  input: ResearchCommand
) {
  return await apiContext.post(`/research`, {
    data: { ...input }
  })
}
export async function deleteResearch(
  apiContext: APIRequestContext,
  docId: string
) {
  return await apiContext.delete(`/research/${docId}`)
}

export async function getResearch(
  apiContext: APIRequestContext,
  filter: string = '',
  page: number = 0,
  size: number = 99999
) {
  return await apiContext.get(
    `/research?filter=title,${filter}&page=${page}&size=${size}`
  )
}
/**
 * @param {APIRequestContext} apiContext - the API request context for the test
 * @param {string} apiContext - API request context
 * @param {string} field - research field to filter on.
 *  Can be one of: 'entity', 'authors', 'services', 'methods', 'segments',
 *  'taxonomyTag1', 'taxonomyTag2', 'taxonomyTag3'
 * @param {number} page - starting page number, default is 0
 * @param {number} size - default is 99999
 * @returns
 */
export async function filterResearch(
  apiContext: APIRequestContext,
  filterMap: Map<string, string[]>,
  page: number = 0,
  size: number = 99999
) {
  const filters = processFilterMap(filterMap)
  return await apiContext.get(`/research?${filters}&page=${page}&size=${size}`)
}

export async function queryResearch(
  apiContext: APIRequestContext,
  searchCommand: SearchCommand
) {
  const queryParams = searchCommand
    ? convertSearchCommandToQueryParams(searchCommand)
    : new URLSearchParams()
  return apiContext.get(`/research?${queryParams}`)
}
export function requiredFieldError(field: string) {
  const blank = ['objectives', 'companyId', 'title']
  return {
    error: '422 UNPROCESSABLE_ENTITY',
    message: 'Invalid field values',
    errors: [
      {
        name: field,
        description: blank.includes(field)
          ? 'must not be blank'
          : 'must not be empty'
      }
    ],
    status: 422
  }
}

export function processFilterMap(filterMap: Map<string, string[]>) {
  let filters: string[] = []
  for (let entry of filterMap.entries()) {
    filters.push('filter=' + encodeURI(`${entry[0]},${entry[1].join('|')}`))
  }
  return filters.join('&')
}
