import {
  CompanySummary,
  EntityModelMapObjectObject,
  PersonSummary
} from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const removeCompanyMember = async (
  companyId: CompanySummary['id'],
  personEmail: PersonSummary['email']
) => {
  const { error, response } = await parseRequest<EntityModelMapObjectObject>(
    axiosApi.delete(`/company/${companyId}/member/${personEmail}`)
  )

  if (error) throw error
  return response.data
}
