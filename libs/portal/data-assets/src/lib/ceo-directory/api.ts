import {
  createExpandParams,
  createFilterParam,
  createSortParam
} from '@redesignhealth/portal/utils'

import { axiosApi } from '../axios-api'
import { FilterField, PagedResult } from '../types'

import {
  Ceo,
  CeoCreateCommand,
  CeoExpansion,
  CeoSearchValues,
  CeoUpdateCommand
} from './types'

export const getCeos = async (
  search: CeoSearchValues,
  page: number,
  expand?: CeoExpansion[]
) => {
  const queryParams: [string, string][] = []

  queryParams.push(['page', `${page}`])

  const {
    query,
    businessFocusAreaFilter,
    fundraiseStatusFilter,
    healthcareSectorFilter,
    businessTypeFilter,
    customerSegmentFilter,
    sort
  } = search

  if (query) {
    queryParams.push(['q', query])
  }

  if (businessFocusAreaFilter.length) {
    queryParams.push(
      createFilterParam('businessFocusArea', businessFocusAreaFilter)
    )
  }

  if (fundraiseStatusFilter.length) {
    queryParams.push(
      createFilterParam('member.company.fundraiseStatus', fundraiseStatusFilter)
    )
  }

  if (healthcareSectorFilter.length) {
    queryParams.push(
      createFilterParam('healthcareSector', healthcareSectorFilter)
    )
  }

  if (businessTypeFilter.length) {
    queryParams.push(createFilterParam('businessType', businessTypeFilter))
  }

  if (customerSegmentFilter.length) {
    queryParams.push(
      createFilterParam('customerSegment', customerSegmentFilter)
    )
  }

  if (sort) {
    queryParams.push(createSortParam(sort))
  }
  queryParams.push(...createExpandParams(expand))
  const urlSearch = new URLSearchParams(queryParams)

  const { data } = await axiosApi.get<PagedResult<Ceo>>(`/ceos?${urlSearch}`)
  return data
}

export const getCeoFilters = async () => {
  const { data } = await axiosApi.get<{ content: FilterField[] }>(
    `/ceos/filters`
  )
  return data.content
}

export const getCeoById = async (id?: string) => {
  const { data } = await axiosApi.get<Ceo>(`/ceos/${id}`)
  return data
}

export const updateCeo = async (id?: string, ceo?: CeoUpdateCommand) => {
  const { data } = await axiosApi.put<Ceo>(`/ceos/${id}`, ceo)
  return data
}

export const createCeo = async (ceo: CeoCreateCommand) => {
  const { data } = await axiosApi.post<Ceo>(`/ceos`, ceo)
  return data
}
