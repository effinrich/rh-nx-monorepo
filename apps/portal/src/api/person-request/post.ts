import {
  PersonRequestCommand,
  PersonRequestSummary
} from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const createPersonRequest = async (body: PersonRequestCommand) => {
  const { error, response } = await parseRequest<PersonRequestSummary>(
    axiosApi.post('/person-request', body)
  )

  if (error) throw error
  return response.data
}
