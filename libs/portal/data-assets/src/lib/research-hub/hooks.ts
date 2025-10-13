import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { PagedResult } from '../types'

import {
  getAllNotes,
  getAllResearch,
  getExpertFilterOptions,
  getFilterOptions,
  Note,
  Research
} from './api'
import {
  CallNoteFilterSelectedOptions,
  ResearchSprintFilterSelectedOptions
} from './types'

export const useGetAllResearch = (
  query?: string,
  filters?: ResearchSprintFilterSelectedOptions,
  pageSize?: number
) =>
  useInfiniteQuery({
    queryKey: ['research', query, filters, pageSize],
    queryFn: ({ pageParam }) =>
      getAllResearch(query, filters, pageSize, pageParam),
    getNextPageParam,
    select: convertResearch,
    initialPageParam: 0
  })

export const useGetFilterOptions = () =>
  useQuery({
    queryKey: ['research', 'filter-options'],
    queryFn: () => getFilterOptions()
  })

export const useGetAllNotes = (
  query?: string,
  filters?: CallNoteFilterSelectedOptions,
  pageSize?: number
) =>
  useInfiniteQuery({
    queryKey: ['note', query, filters, pageSize],
    queryFn: ({ pageParam }) =>
      getAllNotes(query, filters, pageSize, pageParam),
    getNextPageParam,
    select: convertNotes,
    initialPageParam: 0
  })

export const useGetExpertFilterOptions = () =>
  useQuery({
    queryKey: ['note', 'filter-options'],
    queryFn: () => getExpertFilterOptions()
  })

function convertResearch(records: InfiniteData<PagedResult<Research>>) {
  const pages = records.pages.map(page => {
    const content = page.content.map(record => ({
      id:
        record.title.replace(/\W/g, '-') +
        '-' +
        Math.floor(Math.random() * 10000),
      title: record.title,
      sprintAuthor: record.authors.join(', '),
      sprintDate: record.created,
      groupName: record.company?.name || 'Unknown',
      groupStage: record.company?.stage,
      groupDescription: record.company?.description || undefined,
      isConflict: !record.canAccess,
      objectives: record.objectives?.split('\n'),
      services: [...record.services],
      method: record.methods[0],
      segments: [...record.segments],
      taxonomy: [record.taxonomyTag1, record.taxonomyTag2, record.taxonomyTag3],
      reportLink: record.supportingFiles.filter(
        file => file.name === 'report_url'
      )[0]?.href,
      supportingFiles: [...record.supportingFiles],
      highlightedText: record.highlightedText
    }))

    return {
      ...page,
      content
    }
  })

  return {
    ...records,
    pages
  }
}

function convertNotes(records: InfiniteData<PagedResult<Note>>) {
  const pages = records.pages.map(page => {
    const content = page.content.map(record => ({
      id: JSON.stringify(Math.floor(Math.random() * 10000)),
      additionalTags: record.additionalTags,
      intervieweeCompany: record.intervieweeCompany,
      stakeholders: record.stakeholders,
      intervieweeName: record.intervieweeName,
      interviewSource: record.sourceOfInterview,
      companies: [...record.companies],
      noteAuthor: record.noteTaker,
      intervieweeEmail: record.intervieweeEmail,
      linkedInProfileHref: record.linkedInProfileHref,
      attachments: record.attachments,
      created: record.created,
      noteDate: record.created,
      type: record.type,
      groupName: record.companies[0]?.name,
      groupStage: record.companies[0]?.stage,
      groupDescription: record.companies[0]?.description,
      isConflict: !record.canAccess,
      taxonomy: [record.taxonomyTag1, record.taxonomyTag2, record.taxonomyTag3],
      noteLink: record.noteHref,
      highlightedText: record.highlightedText
    }))

    return {
      ...page,
      content
    }
  })

  return {
    ...records,
    pages
  }
}

const getNextPageParam = (
  lastPage: PagedResult<unknown>,
  allPages: PagedResult<unknown>[]
) => {
  if (!lastPage.links.some(link => link.rel === 'next')) {
    return
  }
  return allPages.length
}
