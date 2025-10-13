import type { LibraryDoc } from '@redesignhealth/portal/data-assets'
import { axiosApi } from '@redesignhealth/portal/data-assets'

export const getAllContent = async (
  libraryId: string,
  query?: string,
  moduleType?: string
) => {
  const queryParams = [
    ['expand', 'ancestors'],
    ['page', '0'],
    ['size', '1000']
  ]

  if (query) {
    queryParams.push(['q', query])
  }

  if (moduleType) {
    queryParams.push(['filter', `type,${moduleType}`])
  }

  const urlSearch = new URLSearchParams(queryParams)

  const { data } = await axiosApi.get<{ content: LibraryDoc[] }>(
    `/library/${libraryId}/content?${urlSearch}`
  )

  return data.content
}
