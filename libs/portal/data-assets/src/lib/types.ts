import { CompanySummary } from './companies'

export interface Link {
  rel?: string
  href?: string
  hreflang?: string
  media?: string
  title?: string
  type?: string
  deprecation?: string
  profile?: string
  name?: string
}

export interface CeoReducedInfo {
  id: string
  ceo: boolean
}

export interface PersonSummary {
  email: string
  givenName?: string
  familyName?: string
  roles?: Array<Role>
  role?: Role
  memberOf?: Array<CompanySummary>
  created?: string
  lastModified?: string
  links?: Array<Link>
  ceoInfo: CeoReducedInfo
}

export interface CompanyApiEnum {
  displayName: string
  value: string
}

export const RoleAuthorityEnum = {
  RhAdmin: 'ROLE_RH_ADMIN',
  SuperAdmin: 'ROLE_SUPER_ADMIN',
  RhUser: 'ROLE_RH_USER',
  OpCoUser: 'ROLE_OP_CO_USER',
  OpCoContractor: 'ROLE_OP_CO_CONTRACTOR'
} as const

export type RoleAuthorityEnum =
  typeof RoleAuthorityEnum[keyof typeof RoleAuthorityEnum]

export interface Role {
  authority: RoleAuthorityEnum
  displayName: string
}

export interface UserInfoSummary extends PersonSummary {
  picture?: string
}

/**
 * https://company-api.redesignhealth.com/public/docs/index.html#_pagination
 */
export interface PagedResult<T> {
  content: T[]
  page: {
    size: number
    totalElements: number
    totalPages: number
    number: number
  }
  links: {
    rel: 'first' | 'next' | 'prev' | 'last' | 'self'
    href: string
  }[]
}

export interface Option {
  label: string
  value: string
}

export interface ReactSelectOption {
  displayName?: string
  value?: string
}

export interface Filters {
  links?: Array<Link>
  content?: Array<FilterField>
}

export interface FilterField {
  key: string
  options: FilterFieldOption[]
}

interface FilterFieldOption {
  keyword: string
  displayName?: string
  count: number
}

/**
 * Server error response type
 */
export interface ApiError {
  message: string
  status: number
  errors?: ApiFieldError[]
}

/**
 * Request body field-level error
 * Ex. if { "field1": "value" } were the request payload
 * and "field1" was invalid an error would be returned in the format
 *
 * {
 *   "name": "field1",
 *   "rejectedValue": "value",
 *   "description": "must be a number"
 * }
 */
export interface ApiFieldError {
  name: string
  rejectedValue?: string
  description: string
}

interface BaseNotesProps {
  intervieweeName: string
  intervieweeCompany?: string
  type: string
  sourceOfInterview: string
  intervieweeEmail?: string
  linkedInProfileHref?: string
  stakeholders?: Array<string>
  additionalTags?: Array<string>
  companyIds: string
  noteHref: string
  attachments?: FormData
  noteTaker?: string
}

type AttachmentsProps =
  | { file?: never; isAttachmentDisclaimerAccepted?: never }
  | { file: FormData; isAttachmentDisclaimerAccepted: boolean }

export type NewNotesProps = BaseNotesProps & AttachmentsProps

export interface NewSprintProps {
  companyId: string
  title: string
  methods: string
  authors?: Array<PersonSummary>
  teamRole?: string
  objectives: string
  sampleSize: number
  supportingFiles?: { [name: string]: string }
  additionalSegments?: Array<string>
  specializedMethods?: Array<string>
  reportUrl: string
  services: Array<string>
  segments: Array<string>
}

export interface Roles {
  links?: Array<Link>
  content?: Array<Role>
}

export type PersonReducedInfo = Pick<
  PersonSummary,
  'email' | 'givenName' | 'familyName'
>

export type HighlightedText = Record<string, string[]>
