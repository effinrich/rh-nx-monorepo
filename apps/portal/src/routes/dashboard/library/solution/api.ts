import { axiosApi } from '@redesignhealth/portal/data-assets'

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

export const postCopyTemplate = async (
  id: string | undefined,
  token: string | undefined
) => {
  const { data } = await axiosApi.post(`/library-content/${id}`, undefined, {
    headers: {
      'RH-Google-Access-Token': token
    }
  })

  return data
}
