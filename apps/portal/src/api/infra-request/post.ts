import {
  CompanySummary,
  InfraRequestSummary
} from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const createInfraRequest = async (companyId: CompanySummary['id']) => {
  const { error, response } = await parseRequest<InfraRequestSummary>(
    axiosApi.post(`/infra-request/${companyId}/submit`)
  )

  if (error) throw error

  return response.data
}
