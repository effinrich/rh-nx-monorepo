import { axiosApi } from '../axios-api'
import { FilterField, PagedResult } from '../types'

import {
  CallNoteFilterOptions,
  CallNoteFilterSelectedOptions,
  ResearchSprintFilterOptions,
  ResearchSprintFilterSelectedOptions
} from './types'

export interface Research {
  taxonomyTag1: string
  taxonomyTag2: string
  taxonomyTag3: string
  title: string
  objectives: string
  canAccess: boolean
  services: string[]
  methods: string[]
  segments: string[]
  authors: string[]
  created: string
  company: { id: string; name: string; stage: string; description: string }
  supportingFiles: { href: string; name: string }[]
  highlightedText: { title?: string[]; content?: string[] }
}

export const getAllResearch = async (
  query?: string,
  filters?: ResearchSprintFilterSelectedOptions,
  pageSize = 40,
  pageParam = 0
) => {
  const queryParams = prepareRequestQueryParams(
    researchSprintFieldMapper,
    query,
    filters,
    pageSize,
    pageParam
  )
  const { data } = await axiosApi.get<PagedResult<Research>>(
    `/research?${queryParams}`
  )
  return data
}

function researchSprintFieldMapper(fieldName: string) {
  switch (fieldName) {
    case 'sprintAuthor':
      return 'authors'
    case 'groupName':
      return 'entity'
    default:
      return fieldName
  }
}

function callNotesFieldMapper(fieldName: string) {
  switch (fieldName) {
    case 'noteAuthor':
      return 'noteTaker'
    case 'groupName':
      return 'companies'
    default:
      return fieldName
  }
}

export const getFilterOptions = async () => {
  const { data } = await axiosApi.get<{
    content: FilterField[]
  }>(`/research/filters`)
  return convertFilters(data.content)
}

function convertFilters(records: FilterField[]): ResearchSprintFilterOptions {
  return {
    groupName: records
      .filter(record => record.key === 'entity')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    sprintAuthor: records
      .filter(record => record.key === 'authors')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    services: records
      .filter(record => record.key === 'services')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    method: records
      .filter(record => record.key === 'methods')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    segments: records
      .filter(record => record.key === 'segments')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    taxonomy: [
      ...new Set<string>(
        [
          ...records
            .filter(record => record.key === 'taxonomyTag1')
            .flatMap(record => record.options.map(option => option.keyword)),
          ...records
            .filter(record => record.key === 'taxonomyTag2')
            .flatMap(record => record.options.map(option => option.keyword)),
          ...records
            .filter(record => record.key === 'taxonomyTag3')
            .flatMap(record => record.options.map(option => option.keyword))
        ].sort()
      )
    ]
  }
}

export interface Note {
  additionalTags: string[]
  companies: { id: string; name: string; stage: string; description: string }[]
  taxonomyTag1: string
  taxonomyTag2: string
  taxonomyTag3: string
  type: string
  canAccess: boolean
  stakeholders: string[]
  noteTaker: string
  intervieweeCompany: string
  intervieweeName: string
  intervieweeEmail: string
  linkedInProfileHref: string
  noteHref: string
  created: string
  sourceOfInterview: string
  highlightedText: Record<string, string[]>
  attachments: { href: string; name: string }[]
}

export const getAllNotes = async (
  query?: string,
  filters?: CallNoteFilterSelectedOptions,
  pageSize = 40,
  pageParam = 0
) => {
  const queryParams = prepareRequestQueryParams(
    callNotesFieldMapper,
    query,
    filters,
    pageSize,
    pageParam
  )

  const { data } = await axiosApi.get<PagedResult<Note>>(
    `/expert-note?${queryParams}`
  )
  return data
}

const prepareRequestQueryParams = (
  fieldMapper: (fieldName: string) => string,
  query?: string,
  filters?: Record<string, string[]>,
  pageSize?: number,
  pageParam?: number
) => {
  const queryParams: [string, string][] = []
  queryParams.push(['page', `${pageParam}`])
  queryParams.push(['size', `${pageSize}`])
  queryParams.push(['expand', 'highlightedText'])
  if (query) {
    queryParams.push(['q', query])
  }

  if (filters) {
    Object.entries(filters)
      .filter(([_, values]) => values.length > 0)
      .forEach(([key, values]) =>
        queryParams.push(['filter', `${fieldMapper(key)},${values.join('|')}`])
      )
  }
  return new URLSearchParams(queryParams)
}

function convertExpertFilters(records: FilterField[]): CallNoteFilterOptions {
  return {
    groupName: records
      .filter(record => record.key === 'companies')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    noteAuthor: records
      .filter(record => record.key === 'noteTaker')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    tags: records
      .filter(record => record.key === 'additionalTags')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    stakeholders: records
      .filter(record => record.key === 'stakeholders')
      .flatMap(record => record.options.map(option => option.keyword))
      .sort(),
    taxonomies: [
      ...new Set<string>(
        [
          ...records
            .filter(record => record.key === 'taxonomyTag1')
            .flatMap(record => record.options.map(option => option.keyword)),
          ...records
            .filter(record => record.key === 'taxonomyTag2')
            .flatMap(record => record.options.map(option => option.keyword)),
          ...records
            .filter(record => record.key === 'taxonomyTag3')
            .flatMap(record => record.options.map(option => option.keyword))
        ].sort()
      )
    ]
  }
}

export const getExpertFilterOptions = async () => {
  const { data } = await axiosApi.get<{
    content: FilterField[]
  }>(`/expert-note/filters`)
  return convertExpertFilters(data.content)
}
