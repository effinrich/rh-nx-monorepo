import { CompanyApiEnum, Link, Option, PersonSummary } from '../types'

export interface CompanySummary {
  stage: string
  name: string
  id: string
  number?: number
  legalName?: string
  description?: string
  members?: Array<PersonSummary>
  created?: string
  lastModified?: string
  links?: Array<Link>
  taxonomy?: TaxonomySummary[]
  linkedApiId?: string
  fundraiseStatus?: CompanyApiEnum
  hasPlatformAgreement?: boolean
  dashboardHref?: string
  status?: string
  activityType?: CompanyApiEnum
  organizationType?: CompanyApiEnum
  region?: CompanyApiEnum
  href?: string
}

/**
 * START: Used for Company forms and UI specifically
 **/

export interface CompanyCommand
  extends Omit<
    CompanySummary,
    | 'fundraiseStatus'
    | 'taxonomy'
    | 'activityType'
    | 'organizationType'
    | 'region'
  > {
  fundraiseStatus?: string
  taxonomy?: string
  theme?: Option
  concept?: Option
  conflicts?: Option[]
  activityType?: string
  organizationType?: string | null
  region?: string | null
}

// END: Used for Company forms and UI specifically

export interface TaxonomySummary extends CompanyApiEnum {
  level: number
}

interface InfraRequestForm {
  status: {
    value?: string
    displayName?: string
  }
  type?: {
    value?: string
    displayName?: string
  }
  form?: object
  links?: Array<Link>
}

export interface InfraRequest {
  jiraIssueId?: string
  status: {
    value?: string
    displayName?: string
  }
  forms?: Array<InfraRequestForm>
  links?: Array<Link>
}
