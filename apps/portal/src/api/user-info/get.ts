import { UserInfoSummary } from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const getUserInfo = async () => {
  const { error, response } = await parseRequest<UserInfoSummary>(
    axiosApi.get('/userinfo')
  )

  if (error) throw error
  return response.data
}
