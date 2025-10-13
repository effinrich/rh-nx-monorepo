import { axiosApi } from '@redesignhealth/portal/data-assets'

// Use this interface, if we want, otherwise TS is happy with string | undefined
export interface ModuleProps {
  id: string
  title: string
  description: string
  remoteContentSource: {
    displayName: 'Google Drive'
    value: 'GOOGLE_DRIVE'
  }
  remoteContentId: string
  parentId: string
  type: {
    displayName: 'Article' | 'Template'
    value: 'ARTICLE' | 'TEMPLATE'
  }
  content: string
  links: {
    rel: string
    href: string
  }[]
}

export const getModuleById = async (id: string | undefined) => {
  const { data } = await axiosApi.get(`/library-content/${id}`)
  return data
}

export const getArticleLinkMap = async (
  libraryId: string | undefined,
  libraryRoute: string | undefined
) => {
  const { data } = await axiosApi.get(
    `/library/${libraryId}/content?filter=type%2CTEMPLATE%7C%7CARTICLE%7C%7CVIDEO%7C%7CTOOL&size=1000`
  )

  /**
   * FIXME: use the googleDoc and whatever other URLs are in the links array to construct a map
   * of those URLs to navigate() friendly routes based on article's parent ID and its own id
   */

  const articles: ModuleProps[] = data.content
  if (!articles) {
    return []
  }

  const linkMap = {}
  articles.forEach(article => {
    const remoteContentId = article.remoteContentId
    const libraryRelativeUrl = `/${libraryRoute}/${article.parentId}/module/${article.id}`
    linkMap[remoteContentId] = libraryRelativeUrl
  })

  return linkMap
}

export const postCopyTemplate = async (
  id: string | undefined,
  token: string | undefined
) => {
  const { data } = await axiosApi.post(`/library/topic/${id}/copy`, undefined, {
    headers: {
      'RH-Google-Access-Token': token
    }
  })

  return data
}
