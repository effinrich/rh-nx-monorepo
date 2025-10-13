import { Link } from '../types'

export interface LibraryDoc {
  type: { displayName: string; value: string }
  title: string
  id: string
  category?: string
  description?: string | undefined
  parentId?: string
  ancestors?: LibraryDoc[]
  children?: LibraryDoc[]
  solutionId?: string
  categoryId?: string
  orderId?: number
  links: Link[]
}

export interface CategoryGrouping {
  categoryId?: string
  categoryTitle?: string
  documents: LibraryDoc[]
}
