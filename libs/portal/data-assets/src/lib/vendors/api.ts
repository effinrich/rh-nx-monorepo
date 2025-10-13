import { createFilterParam } from '@redesignhealth/portal/utils'

import { axiosApi } from '../axios-api'
import { Option } from '../types'

import { CompanyVendor } from './company-vendor'
import { type Vendor, type VendorCategory } from './types'

export interface VendorsProps {
  query?: string
  categoryFilter?: Option[]
  subcategoryFilter?: Option[]
}

export const getVendorById = async (id?: string) => {
  const { data } = await axiosApi.get<Vendor>(`/vendor/${id}`)
  return data
}

export const getVendorsFilters = async () => {
  const { data } = await axiosApi.get<{
    content: { key: string; options: { keyword: string; count: number }[] }[]
  }>(`/vendor/filters`)
  return data.content
}

export const getVendors = async (search: VendorsProps, tagCheck?: boolean) => {
  const queryParams: [string, string][] = []

  const { query, categoryFilter, subcategoryFilter } = search
  if (query) {
    queryParams.push(['q', query])
  }

  if (categoryFilter && categoryFilter.length) {
    queryParams.push(createFilterParam('category', categoryFilter))
  }

  if (subcategoryFilter && subcategoryFilter.length) {
    queryParams.push(createFilterParam('subcategory', subcategoryFilter))
  }

  if (tagCheck) {
    queryParams.push(createFilterParam('tagCheck', [{ value: 'true' }]))
  }

  const urlSearch = new URLSearchParams(queryParams)

  const { data } = await axiosApi.get<{ content: Vendor[] }>(
    `/vendor?${urlSearch}`
  )
  return data.content
}

export const getCategories = async () => {
  const { data } = await axiosApi.get<VendorCategory[]>(
    `/categories?expand=subcategories`
  )

  return data
}

export const getCompanyVendors = async (companyId?: string) => {
  const { data } = await axiosApi.get<{ content: Array<CompanyVendor> }>(
    `/company/${companyId}/vendor?expand=contacts`
  )
  return data.content
}

export const getCompanyVendor = async (
  companyId?: string,
  companyVendorId?: string
) => {
  const { data } = await axiosApi.get<CompanyVendor>(
    `/company/${companyId}/vendor/${companyVendorId}?expand=contacts`
  )
  return data
}
