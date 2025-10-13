import { VendorContact, VendorSubcategory } from '../types'

export interface CompanyVendor {
  id?: string
  name: string
  startDate?: string | Date
  endDate?: string | Date
  subcategories: VendorSubcategory[]
  contacts?: VendorContact[]
  engagementStatus?: { displayName: string; value: string }
}
