import { PagedModelPersonRequestSummary } from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const getPersonRequest = async (
  page: number,
  size: number,
  sort: Array<'asc' | 'desc'> = []
) => {
  if (page < 0 || size < 0) {
    throw new Response(`Negative inputs provided`, { status: 500 })
  }

  const params = new URLSearchParams([
    ['page', page.toString()],
    ['size', size.toString()],
    ...sort.map(str => ['sort', str])
  ]).toString()

  const { error, response } =
    await parseRequest<PagedModelPersonRequestSummary>(
      axiosApi.get(`/person?${params}`)
    )

  if (error) throw error
  return response.data
}
