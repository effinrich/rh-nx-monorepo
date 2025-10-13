import {
  createExpandParams,
  createFilterParamFromStringArray,
  createSortParam
} from '@redesignhealth/portal/utils'

import { axiosApi } from '../axios-api'
import { FilterField, PagedResult } from '../types'

import {
  IpExpansion,
  IpMarketplaceRequestContactInfoSummary,
  IpMarketplaceSummary,
  IPSearchValues
} from './types'

export const postAddIP = async (newIP: IpMarketplaceSummary) => {
  const { data } = await axiosApi.post<IpMarketplaceSummary>(
    '/ip-marketplace',
    newIP
  )

  return data
}

export const getCustomers = async () => {
  const { data } = await axiosApi.get<{ content: IpMarketplaceSummary[] }>(
    '/ip-marketplace?page=0&size=500'
  )

  return data
}

export const getIpListing = async (id?: string, expand?: IpExpansion[]) => {
  const queryParams: [string, string][] = []

  queryParams.push(...createExpandParams(expand))
  const urlSearch = new URLSearchParams(queryParams)

  const { data } = await axiosApi.get<IpMarketplaceSummary>(
    `/ip-marketplace/${id}?${urlSearch}`
  )
  return data
}

export const getIPs = async (
  search?: IPSearchValues,
  page?: number,
  expand?: IpExpansion[]
) => {
  const queryParams: [string, string][] = []

  queryParams.push(['page', `${page}`])
  if (search) {
    const {
      query,
      organizationTypeFilter,
      regionFilter,
      specialityFilter,
      organOfFocusFilter,
      technologyTypeFilter,
      companyIdFilter,
      sort
    } = search
    if (query) {
      queryParams.push(['q', query])
    }

    if (organizationTypeFilter.length) {
      queryParams.push(
        createFilterParamFromStringArray(
          'organizationType',
          organizationTypeFilter
        )
      )
    }
    if (regionFilter.length) {
      queryParams.push(createFilterParamFromStringArray('region', regionFilter))
    }
    if (specialityFilter.length) {
      queryParams.push(
        createFilterParamFromStringArray('speciality', specialityFilter)
      )
    }
    if (organOfFocusFilter.length) {
      queryParams.push(
        createFilterParamFromStringArray('organOfFocus', organOfFocusFilter)
      )
    }
    if (technologyTypeFilter.length) {
      queryParams.push(
        createFilterParamFromStringArray('technologyType', technologyTypeFilter)
      )
    }
    if (companyIdFilter) {
      queryParams.push(
        createFilterParamFromStringArray('companyId', companyIdFilter)
      )
    }
    if (sort) {
      queryParams.push(createSortParam(sort))
    }
  }

  queryParams.push(['size', '500'])
  queryParams.push(...createExpandParams(expand))

  const urlSearch = new URLSearchParams(queryParams)

  const { data } = await axiosApi.get<PagedResult<IpMarketplaceSummary>>(
    `/ip-marketplace?${urlSearch}`
  )
  return data
}

export const getIPFilters = async () => {
  const { data } = await axiosApi.get<{ content: FilterField[] }>(
    `/ip-marketplace/filters`
  )
  return data.content
}

export const putMeIpMarketplaceContactInfo = async (
  ipListingId?: string,
  buyerEmail?: string
) => {
  const { data } = await axiosApi.put<IpMarketplaceRequestContactInfoSummary>(
    `/me/ip-marketplace/${ipListingId}/contact-info`,
    {
      buyerEmail
    }
  )
  return data
}
