import { create } from 'zustand'

import { Vendor, VendorCategory } from './types'

export interface VendorCompany {
  id: string | undefined
  name: string | undefined
}

interface State {
  selectedCategory: VendorCategory
  categories: VendorCategory[]
  searchQuery: string
  categoryFilter: VendorCategory | null
  modal: string | undefined
  selectedCompany: VendorCompany
  companies: VendorCompany[]
  enforceSearchTerms: boolean
  vendors: Vendor[]
}

export const VENDOR_VIEW_ALL_CATEGORY: VendorCategory = {
  name: 'View all',
  apiId: ''
}

interface Action {
  setSelectedCategory: (currentCategory: State['selectedCategory']) => void
  setCategories: (categories: State['categories']) => void
  setSearchQuery: (searchQuery: State['searchQuery']) => void
  setCategoryFilter: (categoryFilter: State['categoryFilter']) => void
  setModal: (modal: State['modal']) => void
  setSelectedCompany: (selectedCompany: State['selectedCompany']) => void
  setCompanies: (companies: State['companies']) => void
  setEnforceSearchTerms: (
    enforceSearchTerms: State['enforceSearchTerms']
  ) => void
  setVendors: (vendors: State['vendors']) => void
}

// Create your store, which includes both state and (optionally) actions
export const useCategoryStore = create<State & Action>(set => ({
  selectedCategory: VENDOR_VIEW_ALL_CATEGORY,
  categories: [],
  categoryFilter: null,
  searchQuery: '',
  modal: undefined,
  selectedCompany: { id: undefined, name: undefined },
  companies: [],
  enforceSearchTerms: false,
  vendors: [],
  setSelectedCategory: selectedCategory => set(() => ({ selectedCategory })),
  setCategories: categories => set(() => ({ categories })),
  setCategoryFilter: categoryFilter => set(() => ({ categoryFilter })),
  setSearchQuery: searchQuery => set(() => ({ searchQuery })),
  setModal: modal => set(() => ({ modal })),
  setSelectedCompany: selectedCompany => set(() => ({ selectedCompany })),
  setCompanies: companies => set(() => ({ companies })),
  setEnforceSearchTerms: enforceSearchTerms =>
    set(() => ({ enforceSearchTerms })),
  setVendors: vendors => set(() => ({ vendors }))
}))
