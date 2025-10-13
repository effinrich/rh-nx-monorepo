export interface Vendor {
  id?: string
  name?: string
  status?: string
  startDate?: string
  endDate?: string
  willingToDiscuss?: boolean
  categories?: Array<Category>
  subcategories?: Array<SubCategory>
}

export interface Category {
  name?: string
  id?: string
}

export interface SubCategory extends Category {
  category?: Category
}

export const engagementStatuses = [
  { value: 'CONSIDERED', displayName: 'Considered' },
  { value: 'ACTIVE', displayName: 'Active' },
  { value: 'FORMER', displayName: 'Former' }
]
