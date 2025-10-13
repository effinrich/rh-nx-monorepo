import {
  CollectionModelPersonSummary,
  CompanySummary,
  PagedModelCompanySummary
} from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const getCompanyById = async (
  companyId: CompanySummary['id'],
  expand: Array<'forms' | 'members' | 'memberOf'> = []
) => {
  const params = new URLSearchParams(
    expand.map(str => ['expand', str])
  ).toString()

  const { error, response } = await parseRequest<CompanySummary>(
    axiosApi.get(`/company/${companyId}?${params}`)
  )

  if (error) {
    // company does not exist
    if (error.response?.status === 404) return null
    throw error
  }

  return response.data
}

export const getCompanyList = async (args: {
  page: number
  size: number
  expand?: Array<'forms' | 'members' | 'memberOf'>
}) => {
  const { expand = [], page, size } = args

  if (page < 0 || size < 0) {
    throw new Response(`Negative inputs provided`, { status: 500 })
  }

  const params = new URLSearchParams([
    ['page', page.toString()],
    ['size', size.toString()],
    ...expand.map(str => ['expand', str])
  ]).toString()

  const { error, response } = await parseRequest<PagedModelCompanySummary>(
    axiosApi.get(`/company?${params}`)
  )

  if (error) throw error
  return response.data
}

export const getCompanyMembers = async (
  companyId: CompanySummary['id'],
  expand: Array<'forms' | 'members' | 'memberOf'> = []
) => {
  const params = new URLSearchParams(
    expand.map(str => ['expand', str])
  ).toString()

  const { error, response } = await parseRequest<CollectionModelPersonSummary>(
    axiosApi.get(`/company/${companyId}/members?${params}`)
  )

  if (error) throw error
  return response.data
}
