import {
  CompanySummary,
  InfraRequestSummary
} from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const getInfraRequest = async (
  companyId: CompanySummary['id'],
  expand: Array<'forms' | 'members' | 'memberOf'> = []
) => {
  const params = new URLSearchParams(
    expand.map(str => ['expand', str])
  ).toString()

  const { error, response } = await parseRequest<InfraRequestSummary>(
    axiosApi.get(`/infra-request/${companyId}?${params}`)
  )

  if (error) {
    // infra request does not exist
    if (error?.response?.status === 404) return null
    throw error
  }

  return response.data
}
