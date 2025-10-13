import { useQuery } from '@tanstack/react-query'
import { parseISO } from 'date-fns'

import {
  getCategories,
  getCompanyVendor,
  getCompanyVendors,
  getVendorById,
  getVendors,
  getVendorsFilters,
  VendorsProps
} from './api'
import { CompanyVendor } from './company-vendor'
import {
  CompanyVendorProps,
  Vendor,
  VendorCategory,
  VendorSubcategory
} from './types'

export const VENDORS_QUERY_KEY = 'vendors'

export const useGetVendorById = (id?: string) => {
  return useQuery({
    queryKey: [VENDORS_QUERY_KEY, id],
    queryFn: () => getVendorById(id),
    enabled: !!id,
    select: data => ({
      ...data,
      categories: getVendorCategories(data)
    })
  })
}

export const useGetCompanyVendors = (companyId?: string) => {
  return useQuery({
    queryKey: [VENDORS_QUERY_KEY, 'company', companyId],
    queryFn: () => getCompanyVendors(companyId),
    enabled: !!companyId,
    select: data =>
      data.map(companyVendor => ({
        ...companyVendor,
        categories: getVendorCategories(companyVendor)
      }))
  })
}

export const useGetCompanyVendor = (
  companyId?: string,
  companyVendorId?: string
) => {
  return useQuery({
    queryKey: [
      VENDORS_QUERY_KEY,
      'company',
      companyId,
      'companyVendor',
      companyVendorId
    ],
    queryFn: () => getCompanyVendor(companyId, companyVendorId),
    enabled: !!companyId && !!companyVendorId,
    select: (companyVendor): CompanyVendorProps => {
      return {
        ...companyVendor,
        startDate: companyVendor.startDate
          ? parseISO(companyVendor.startDate.toString())
          : undefined,
        endDate: companyVendor.endDate
          ? parseISO(companyVendor.endDate.toString())
          : undefined,
        engagementStatus: companyVendor.engagementStatus?.value,
        willingToDiscuss: companyVendor.contacts?.some(
          contact => contact.willingToDiscuss
        )
      }
    }
  })
}

export const useGetVendors = (search: VendorsProps) =>
  useQuery({
    queryKey: [VENDORS_QUERY_KEY, search],
    queryFn: () => getVendors(search),
    select: data =>
      data.map(vendor => ({
        ...vendor,
        categories: getVendorCategories(vendor)
      }))
  })

export const useGetVendorTags = (name?: string) => {
  const search: VendorsProps = { query: name }
  return useQuery({
    queryKey: [VENDORS_QUERY_KEY, search],
    queryFn: () => getVendors(search, true),
    enabled: !!name,
    select: data => {
      if (data.length === 0) {
        return []
      }
      const vendor = data[0]
      if (name !== vendor.name) {
        return []
      }
      //console.log(vendor)
      return vendor.subcategories.map(subcategory => ({
        apiId: subcategory.apiId,
        name: subcategory.name.trim(),
        category: {
          apiId: subcategory.category.apiId,
          name: subcategory.category.name.trim()
        }
      }))
    }
  })
}

export const useGetVendorsNames = () =>
  useQuery({
    queryKey: [VENDORS_QUERY_KEY, 'filters'],
    queryFn: () => getVendorsFilters(),
    select: data =>
      data[0].options.map(({ keyword }) => ({ label: keyword, value: keyword }))
  })

export const useGetCategoriesFilters = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    select: data => {
      const categories = [
        ...new Set<string>(data.map(category => category.name.trim()))
      ]
        .map(category => ({
          label: category,
          value: category
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      const subcategories = [
        ...new Set<string>(
          data.flatMap(category =>
            category.subcategories
              ? category.subcategories.map(subcategory =>
                  subcategory.name.trim()
                )
              : []
          )
        )
      ]
        .map(category => ({
          label: category,
          value: category
        }))
        .sort((a, b) => a.label.localeCompare(b.label))

      const subcategoriesForMutation = [
        ...new Set<VendorSubcategory>(
          data.flatMap(category =>
            category.subcategories
              ? category.subcategories.map(subcategory => ({
                  apiId: subcategory.apiId,
                  name: subcategory.name.trim(),
                  category: {
                    apiId: category.apiId,
                    name: category.name.trim()
                  }
                }))
              : []
          )
        )
      ]
        .map(subcategory => ({
          displayName: subcategory.name,
          value: subcategory
        }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName))

      return { categories, subcategories, subcategoriesForMutation }
    }
  })

export const getVendorCategories = (
  vendor: Vendor | CompanyVendor
): VendorCategory[] => {
  return [
    ...new Map<string, VendorCategory>(
      vendor.subcategories.map(subcategory => [
        subcategory.category.name.trim(),
        subcategory.category
      ])
    ).values()
  ]
}
