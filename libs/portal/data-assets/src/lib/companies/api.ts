import { AxiosError } from 'axios'
import qs from 'qs'

import { axiosApi } from '../axios-api'
import { ApiError, PagedResult } from '../types'

import { CompanyCommand, CompanySummary } from './types'
import { InfraRequest } from './types'

export interface UserDetailsSlimProps {
  givenName: string
  familyName: string
  email: string
  status: string
}

export const getCompanies = async (page = 0, size = 500, expand?: string[]) => {
  const queryString = qs.stringify(
    { page, size, expand },
    { arrayFormat: 'comma' }
  )
  const { data } = await axiosApi.get<PagedResult<CompanySummary>>(
    `/company?${queryString}`
  )

  return data
}

export const getCompanyMembers = async (companyId?: string) => {
  const { data } = await axiosApi.get<{ content: UserDetailsSlimProps[] }>(
    `/company/${companyId}/members`
  )

  return data.content
}

export const getCompanyById = async (companyId?: string) => {
  const { data } = await axiosApi.get<CompanySummary>(`/company/${companyId}`)

  return data
}

export const getInfraRequest = async (args: {
  companyId: string | undefined
  expand: Array<'forms' | 'members' | 'memberOf'>
}) => {
  const { companyId, expand = [] } = args

  const queryString = qs.stringify({ expand }, { arrayFormat: 'comma' })

  try {
    const { data } = await axiosApi.get<InfraRequest>(
      `/infra-request/${companyId}?${queryString}`
    )
    return data
  } catch (e) {
    if ((e as AxiosError<ApiError>).response?.status === 404) {
      return null
    }
    throw e
  }
}

export const postCompany = async (newCompany: CompanyCommand) => {
  if (newCompany.concept) {
    newCompany.linkedApiId = newCompany.concept.value
  } else if (newCompany.theme) {
    newCompany.linkedApiId = newCompany.theme.value
  }
  const { data } = await axiosApi
    .post<CompanyCommand>('/company', newCompany)
    .then(postResponse => {
      return axiosApi.put(`/company/${postResponse.data.id}/conflicts`, {
        conflicts: newCompany.conflicts
          ? newCompany?.conflicts?.map(option => option.value)
          : []
      })
    })

  return data
}

export const putCompany = async (
  updatedCompany: CompanyCommand,
  id?: string
) => {
  if (updatedCompany.concept) {
    updatedCompany.linkedApiId = updatedCompany.concept.value
  }

  const { data } = await axiosApi
    .put(`/company/${id}`, updatedCompany)
    .then(() => {
      return axiosApi.put(`/company/${id}/conflicts`, {
        conflicts: updatedCompany.conflicts
          ? updatedCompany?.conflicts?.map(option => option.value)
          : []
      })
    })

  return data
}
