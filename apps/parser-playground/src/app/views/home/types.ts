export interface TopicProps {
  id: string
  title: string
  description: string
  type: {
    displayName: string
    value: string
  }
  content: string
  parentId: string
  remoteContentId: string
  remoteContentSource: {
    displayName: 'Google Drive'
    value: 'GOOGLE_DRIVE'
  }
  links: {
    rel: string
    href: string
  }[]
}

export interface SearchProps {
  id: string
  title: string
  description: string
  category: string
  type: {
    displayName: 'Article' | 'Template'
    value: 'ARTICLE' | 'TEMPLATE'
  }
  links: {
    rel: string
    href: string
  }[]
  metadata: {
    url: string
    labels: string[]
  }
}
