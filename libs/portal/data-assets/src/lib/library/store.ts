import { create } from 'zustand'

import { Option } from '../../index'

export interface LibraryCategory {
  title: string
  id: string
  type?: { displayName: string; value: string } | undefined
}

export const VIEW_ALL_OPTION: Option = {
  value: '',
  label: 'View All'
}
export const DEFAULT_CONTENT_TYPE: Option = {
  label: 'Collection',
  value: 'SOLUTION'
}
interface State {
  categories: LibraryCategory[]
  searchQuery: string
  categoryFilter: Option | null
  moduleTypeValue: Option | null
}

interface Action {
  setCategories: (categories: State['categories']) => void
  setSearchQuery: (searchQuery: State['searchQuery']) => void
  setCategoryFilter: (categoryFilter: State['categoryFilter']) => void
  setModuleTypeValue: (moduleTypeValue: State['moduleTypeValue']) => void
  reset: () => void
}

const initialState = {
  categories: [],
  categoryFilter: VIEW_ALL_OPTION,
  searchQuery: '',
  moduleTypeValue: VIEW_ALL_OPTION
}

// Create your store, which includes both state and (optionally) actions
export const useLibraryStore = create<State & Action>(set => ({
  ...initialState,
  setCategories: categories => set(() => ({ categories })),
  setCategoryFilter: categoryFilter => set(() => ({ categoryFilter })),
  setSearchQuery: searchQuery => set(() => ({ searchQuery })),
  setModuleTypeValue: moduleTypeValue => set(() => ({ moduleTypeValue })),
  reset: () => set(initialState)
}))
