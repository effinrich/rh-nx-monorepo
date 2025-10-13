import {
  PagedModelPersonSummary,
  PersonSummary
} from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const getPerson = async (
  email: PersonSummary['email'],
  expand: Array<'forms' | 'members' | 'memberOf'> = []
) => {
  const params = new URLSearchParams(
    expand.map(str => ['expand', str])
  ).toString()

  const { error, response } = await parseRequest<PersonSummary>(
    axiosApi.get(`/person/${email}?${params}`)
  )

  if (error) {
    // user does not exist
    if (error.response?.status === 404) return null
    throw error
  }

  return response.data
}

export const getPersonList = async (args: {
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

  const { error, response } = await parseRequest<PagedModelPersonSummary>(
    axiosApi.get(`/person?${params}`)
  )

  if (error) throw error
  return response.data
}
