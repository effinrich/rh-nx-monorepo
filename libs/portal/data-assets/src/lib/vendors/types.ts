import { CompanyApiEnum } from '../types'
import { Link } from '../types'

export interface VendorContact {
  email: string
  givenName?: string
  familyName?: string
  willingToDiscuss: boolean
}

export type VendorSubcategory = VendorCategory & {
  category: VendorCategory
}

export interface Vendor {
  links?: Link[]
  apiId: string
  vendorType?: CompanyApiEnum
  name: string
  subcategories: VendorSubcategory[]
  vendorPointContact?: string
  cons?: string
  contacts?: VendorContact[]
  categories?: VendorCategory[]
  description?: string
  discountInfo?: string
  feedbackFromOpCos?: string
  features?: string
  pricing?: string
  pros?: string
  created: string
  lastModified: string
  hasPlatformAgreement?: boolean
}

export interface VendorFormProps {
  name: string
  vendorType: string
  vendorPointContact: string
  subcategories?: VendorSubcategory[] | null
  pricing?: string
  discountInfo?: string
  pros?: string
  cons?: string
  features?: string
  description?: string
  hasPlatformAgreement?: boolean
  feedbackFromOpCos?: string
}

export interface VendorCategory {
  name: string
  apiId: string
  subcategories?: { apiId: string; name: string }[]
}

export interface CompanyVendorProps {
  name: string
  subcategories: VendorSubcategory[]
  willingToDiscuss?: boolean
  // startDate?: Date | null | undefined
  // endDate?: Date | null | undefined
  startDate?: string | Date
  endDate?: string | Date
  engagementStatus?: string
  vendorType?: string
}

export const COMPANY_VENDOR_FORM_DEFAULT_VALUES: CompanyVendorProps = {
  name: '',
  subcategories: [],
  willingToDiscuss: true,
  engagementStatus: '',
  vendorType: '',
  startDate: undefined,
  endDate: undefined
}
