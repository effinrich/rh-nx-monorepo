import { CompanyApiEnum } from '@redesignhealth/portal/data-assets'
import { create } from 'zustand'

export interface Category {
  title: string
  id: string
  type?: CompanyApiEnum
}

interface State {
  selectedDevCategory: Category
}

export const VIEW_ALL_CATEGORY = { title: 'View all', id: 'VIEW_ALL' }

interface Action {
  setSelectedDevCategory: (
    currentCategory: State['selectedDevCategory']
  ) => void
}

// Create your store, which includes both state and (optionally) actions
export const useDevCategoryStore = create<State & Action>(set => ({
  selectedDevCategory: VIEW_ALL_CATEGORY,
  setSelectedDevCategory: selectedDevCategory =>
    set(() => ({ selectedDevCategory }))
}))
