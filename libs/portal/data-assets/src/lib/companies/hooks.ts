import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiError } from '../types'

import {
  getCompanies,
  getCompanyById,
  getCompanyMembers,
  getInfraRequest,
  postCompany,
  putCompany
} from './api'
import { CompanyCommand, CompanySummary } from './types'

const COMPANY_CACHE_KEY = 'company'

export const useGetCompanies = (page = 0, size = 500, expand = ['members']) =>
  useQuery({
    queryKey: [COMPANY_CACHE_KEY, page, size, expand],
    queryFn: () => getCompanies(page, size, expand),
    select: data => ({
      ...data,
      content: data.content.map(company => ({
        ...company,
        isMarketplaceCompany: isMarketplaceCompany(company)
      }))
    })
  })

export const useGetCompaniesCount = () => {
  const companies = useGetCompanies()
  if (!companies.data) {
    return undefined
  }
  return companies.data.content.length
}

export const useGetCompanyMembers = (companyId?: string) =>
  useQuery({
    queryKey: [COMPANY_CACHE_KEY, companyId, 'members'],
    queryFn: () => getCompanyMembers(companyId),
    enabled: !!companyId
  })

export const useGetCompanyById = (companyId: string | undefined) =>
  useQuery({
    queryKey: [COMPANY_CACHE_KEY, companyId],
    queryFn: () => getCompanyById(companyId),
    enabled: !!companyId,
    select: data => ({
      ...data,
      isMarketplaceCompany: !!data.activityType
    })
  })

export const useGetInfraRequest = (
  companyId: string | undefined,
  expand: Array<'forms' | 'members' | 'memberOf'>
) =>
  useQuery({
    queryKey: ['infra-request', companyId, expand],
    queryFn: () => getInfraRequest({ companyId, expand }),
    enabled: !!companyId
  })

export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (newCompany: CompanyCommand) => postCompany(newCompany),
    onError: (error: AxiosError<ApiError>) => {
      return (error.response?.status || 0) >= 500
    },
    async onSuccess() {
      queryClient.removeQueries({ queryKey: [COMPANY_CACHE_KEY] })
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}

export const useUpdateCompany = (id?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updatedCompany: CompanyCommand) =>
      putCompany(updatedCompany, id),
    onError: (error: AxiosError<ApiError>) => {
      return (error.response?.status || 0) >= 500
    },
    async onSuccess() {
      queryClient.removeQueries({
        queryKey: [COMPANY_CACHE_KEY]
      })
    }
  })
}

export const convertCompanyToCommand = (
  company: CompanySummary
): CompanyCommand => ({
  ...company,
  fundraiseStatus: company.fundraiseStatus?.value,
  // get lowest level taxonomy term
  taxonomy: company.taxonomy?.find(term => term.level === 3)?.value,
  activityType: company.activityType?.value,
  organizationType: company.organizationType?.value,
  region: company.region?.value
})

/**
 * We can infer a company is an Marketplace company based on whether or not the
 * activity type is filled out. This field is specific to Marketplace companies.
 */
const isMarketplaceCompany = (company: CompanySummary) => !!company.activityType
