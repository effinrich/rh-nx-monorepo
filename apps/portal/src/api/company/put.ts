import {
  CompanyCommand,
  CompanySummary,
  EntityModelMapObjectObject,
  PersonSummary
} from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const updateCompany = async (
  companyId: CompanySummary['id'],
  body: CompanyCommand
) => {
  const res = await axiosApi.put(`/company/${companyId}`, body)
  return res.data as CompanySummary
}

export const addCompanyMember = async (
  companyId: CompanySummary['id'],
  personEmail: PersonSummary['email']
) => {
  const { error, response } = await parseRequest<EntityModelMapObjectObject>(
    axiosApi.put(`/company/${companyId}/member/${personEmail}`)
  )

  if (error) throw error
  return response.data
}
