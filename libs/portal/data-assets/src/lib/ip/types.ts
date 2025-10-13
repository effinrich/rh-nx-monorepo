import { CompanyApiEnum, Link, PersonReducedInfo } from '../types'

export interface IpMarketplaceOrganizationSummary {
  name: string
  activityType?: CompanyApiEnum
  organizationType?: CompanyApiEnum
  region?: CompanyApiEnum
}

type MarketplaceUserInfo = Partial<PersonReducedInfo> & { companyName: string }

export interface IpMarketplaceRequestContactInfo {
  dateRequest: string
  dateRelease?: string
  buyerInfo: MarketplaceUserInfo
  sellerInfo: MarketplaceUserInfo
}

export interface IpMarketplaceRequestContactInfoSummary {
  date: string
}

export interface IpMarketplaceSummary {
  id: string
  disease: string
  executiveSummary: string
  name: string
  organOfFocus: CompanyApiEnum[]
  aboutLicenseRestriction?: string
  associatedFilesOrMedia?: Link[]
  copyrighted?: boolean
  freedomToOperateCertification?: CompanyApiEnum
  legalPatentabilityAssessmentAvailable?: boolean
  licenseRestriction?: boolean
  links?: Link[]
  metrics?: {
    viewCount: number
    requestCount: number
  }
  patentGeographicValidity?: CompanyApiEnum[]
  patentGeographicValidityOther?: string
  patentIssueDate?: string // date-time
  patentStatus?: CompanyApiEnum
  patentStatusHref?: string
  patentStatusOtherInfo?: string
  preferredTerms?: CompanyApiEnum[]
  responsibleInventor?: string
  sellerSummaryTechTransferApproach?: string
  speciality?: CompanyApiEnum[]
  technologyLevelOfMaturity?: CompanyApiEnum[]
  technologyOverview?: string
  technologyType: CompanyApiEnum[]
  therapeuticNeedOrTrendsBeingAddressed?: string
  organization: IpMarketplaceOrganizationSummary
  owner?: PersonReducedInfo
  requestContactInfo?: IpMarketplaceRequestContactInfo[]
  preferredTermsOther?: string
}

export interface Files {
  fileName: string
  dir: string
  added: string
  updated: string
  visible: true
}

export interface IpMarketplaceFilters {
  organizationTypeFilter: string[]
  regionFilter: string[]
  specialityFilter: string[]
  organOfFocusFilter: string[]
  technologyTypeFilter: string[]
  companyIdFilter: string[]
}

export interface IPSearchValues extends IpMarketplaceFilters {
  query?: string
  sort?: string
  isHideIpListings?: boolean
}

export type IpExpansion = 'metrics' | 'requests'
