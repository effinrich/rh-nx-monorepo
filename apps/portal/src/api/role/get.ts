import { CollectionModelRole } from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const getRoles = async () => {
  const { error, response } = await parseRequest<CollectionModelRole>(
    axiosApi.get('/me/role')
  )

  if (error) throw error
  return response.data
}
