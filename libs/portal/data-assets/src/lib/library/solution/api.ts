import { axiosApi } from '../../axios-api'
import { LibraryDoc } from '../types'

// Use this interface, if we want, otherwise TS is happy with string | undefined
export interface SolutionProps {
  id: string
  title: string
  description: string
  type: {
    displayName: 'Solution' | 'Template'
    value: 'SOLUTION' | 'TEMPLATE'
  }
  content: string
  links: {
    rel: string
    href: string
  }[]
}

export const getSolutionById = async (id: string | undefined) => {
  const { data } = await axiosApi.get<LibraryDoc>(
    `/library-content/${id}?expand=children`
  )
  if (data.children) {
    data.children.sort((a, b) => (a.orderId || 0) - (b.orderId || 0))
  }
  return data
}

export const postCopyTemplate = async (
  id: string | undefined,
  token: string | undefined
) => {
  const { data } = await axiosApi.post<LibraryDoc>(
    `/library-content/${id}`,
    undefined,
    {
      headers: {
        'RH-Google-Access-Token': token
      }
    }
  )

  return data
}
