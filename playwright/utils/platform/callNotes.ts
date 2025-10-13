import { faker } from '@faker-js/faker'
import { APIRequestContext } from '@playwright/test/types/test'
import { convertSearchCommandToQueryParams } from './utils'
import { PLATFORM_USERS } from '../../data/platform/users'
import {
  INTERVIEW_SOURCES,
  NOTE_TYPES,
  STAKEHOLDERS
} from '../../data/platform/call-note'

export async function createNotes(
  apiContext: APIRequestContext,
  input: CallNoteCommand,
  impersonate: string | null = null
) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  config['data'] = { ...input }
  return await apiContext.post(`/expert-note`, config)
}

export async function deleteNote(apiContext: APIRequestContext, docId: string) {
  return await apiContext.delete(`/expert-note/${docId}`)
}

export async function getNotes(
  apiContext: APIRequestContext,
  filter: string = '',
  page: number = 0,
  size: number = 99999
) {
  return await apiContext.get(
    `/expert-note?filter=title,${filter}&page=${page}&size=${size}`
  )
}
export async function getNoteFilters(apiContext: APIRequestContext) {
  const resp = await apiContext.get('/expert-note/filters')
  if (resp.status() !== 200) {
    console.log('status:', resp.status())
    try {
      console.log(await resp.json())
    } catch (e) {
      console.log(e.message)
    }
    throw new Error('Get note filters failed!')
  }
  return resp
}
/**
 * @param {APIRequestContext} apiContext - the API request context for the test
 * @param {string} apiContext - API request context
 * @param {string} field - expert note field to filter on.
 *  Can be one of: 'entity', 'authors', 'services', 'methods', 'segments',
 *  'taxonomyTag1', 'taxonomyTag2', 'taxonomyTag3'
 * @param {number} page - starting page number, default is 0
 * @param {number} size - default is 99999
 * @returns
 */
export async function filterNotes(
  apiContext: APIRequestContext,
  filterMap: Map<string, string[]>,
  page: number = 0,
  size: number = 99999
) {
  const filters = processFilterMap(filterMap)
  return await apiContext.get(
    `/expert-note?${filters}&page=${page}&size=${size}`
  )
}

export async function queryNotes(
  apiContext: APIRequestContext,
  searchCommand: SearchCommand
) {
  const queryParams = searchCommand
    ? convertSearchCommandToQueryParams(searchCommand)
    : new URLSearchParams()
  return apiContext.get(`/expert-note?${queryParams}`)
}

export function processFilterMap(filterMap: Map<string, string[]>) {
  let filters: string[] = []
  for (let entry of filterMap.entries()) {
    filters.push('filter=' + encodeURI(`${entry[0]},${entry[1].join('|')}`))
  }
  return filters.join('&')
}

export async function testCallNoteGenerator(
  request: APIRequestContext,
  input: Partial<CallNoteCommand>
) {
  const data = {
    intervieweeName: input['intervieweeName']
      ? input['intervieweeName']
      : faker.person.fullName(),
    noteTaker: input['noteTaker']
      ? input['noteTaker']
      : PLATFORM_USERS.rhUser.email,
    type: input['type']
    ? input['type']
    : faker.helpers.arrayElement(NOTE_TYPES),
    sourceOfInterview: input['sourceOfInterview']
      ? input['sourceOfInterview']
      : faker.helpers.arrayElement(INTERVIEW_SOURCES),
    noteHref: input['noteHref'] ? input['noteHref'] : faker.internet.url(),
    companyIds: input['companyIds'],
    intervieweeCompany: input['intervieweeCompany']
      ? input['intervieweeCompany']
      : faker.lorem
          .words({ min: 1, max: 3 })
          .replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
    intervieweeEmail: input['intervieweeEmail']
      ? input['intervieweeEmail']
      : faker.internet.email(),
    linkedApiId: input['intervieweeEmail']
      ? input['intervieweeEmail']
      : faker.internet.email().toLowerCase(),
    linkedInProfileHref: input['linkedInProfileHref']
      ? input['linkedInProfileHref']
      : faker.internet.url(),
    stakeholders: input['stakeholders']
      ? input['stakeholders']
      : faker.helpers.arrayElements(STAKEHOLDERS),
    additionalTags: input['additionalTags']
      ? input['additionalTags']
      : [
          faker.lorem.word({ length: { min: 5, max: 8 } }),
          faker.lorem.word({ length: { min: 5, max: 8 } }),
          faker.lorem.word({ length: { min: 5, max: 8 } })
        ],
  }
  if (input['attachments']) {
    data['attachments'] = input['attachments']
  }

  const resp = await createNotes(request, data)
  if (resp.status() !== 201) {
    await console.log('Notes input:', data)
    await console.log('status:', resp.status())
    await console.log('json:', await resp.json())
    throw new Error('Create call notes failed!')
  }
  return (await resp.json()) as CallNoteSummary
}
