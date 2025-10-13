type FundraiseStatus =
  | 'PRE_LAUNCH_PHASE'
  | 'PRE_SERIES_A'
  | 'SERIES_A'
  | 'SERIES_B'
  | 'SERIES_C'
interface CompanyCommand {
  name?: string
  number?: number
  legalName?: string
  description?: string
  createGFolder?: boolean
  href?: string
  hasPlatformAgreement?: boolean
  taxonomy?: Taxonomy
  fundraiseStatus?: string | FundraiseStatus
  stage?: string | EntityStage
  status?: string | EntityStatus
  linkedApiId?: string
  dashboardHref?: string
}
type EntityStage = 'THEME' | 'CONCEPT' | 'NEW_CO' | 'OP_CO'
type EntityStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED'

interface BaseResponse {
  created: string
  lastModified: string
  links: {
    rel: string
    href: string
  }[]
}
interface Taxonomy {
  value: string
  displayName: string
  level: number
}
interface CompanySummary extends BaseResponse {
  name: string
  id: string
  number?: number
  legalName?: string
  description?: string
  members?: PersonSummary[]
  stage: EntityStage
  status: EntityStatus
  linkedApiId?: string
  taxonomy?: Taxonomy
  fundraiseStatus?: { value: string; displayName: string }
  href: string
  dashboardHref: string
  hasPlatformAgreement: boolean
}
type role =
  | 'ROLE_SUPER_ADMIN'
  | 'ROLE_RH_ADMIN'
  | 'ROLE_RH_USER'
  | 'ROLE_OP_CO_USER'
interface PersonCommand {
  email?: string
  givenName?: string
  familyName?: string
  role?: string | role
}

interface PersonSummary extends BaseResponse {
  email: string
  givenName?: string
  familyName?: string
  memberOf?: CompanySummary[]
  created: string
  lastModified: string
  roles?: [{ authority: string, displayName: string }]
}

interface List<T> {
  content: T[]
}

interface LibrarySummary {
  id: string
  displayName: string
  links: {
    rel: string
    href: string
  }[]
}

interface LibraryCommand {
  displayName: string
}

type LibraryContentType = 'CATEGORY' | 'SOLUTION' | 'ARTICLE' | 'TEMPLATE'

interface LibraryContentSummary extends BaseResponse {
  id: string
  title: string
  description?: string
  type: {
    displayName: string
    value: LibraryContentType
  }
  parentId?: string
  children?: LibraryContentSummary[]
  ancestors?: LibraryContentSummary[]
  descendants?: LibraryContentSummary[]
}

interface LibraryContentCommand {
  title: string
  description?: string
  type: LibraryContentType
  parentId?: string
  libraryId?: string
  remoteContentSource?: string
  remoteContentId?: string
}

interface SearchCommand {
  q?: string
  filters?: string[][]
}

interface SupportingFile {
  href: string
  name: string
}
interface ResearchCommand {
  title: string
  authors: string[]
  objectives: string
  services: string[]
  segments: string[]
  methods: string[]
  supportingFiles?: SupportingFile[]
  sampleSize?: number
  teamRole?: string
  additionalSegments?: string[]
  specializedMethods?: string[]
  companyId: string
}

interface ResearchSummary extends BaseResponse {
  id: string
  title: string
  authors: string[]
  company: {
    id: string
    name: string
  }
  entity: string
  specializedMethods?: string[]
  objectives: string
  services: string[]
  methods: string[]
  sampleSize?: number
  segments: string[]
  supportingFiles?: SupportingFile[]
  canAccess: boolean
  teamRole?: string
  taxonomyTag1: string
  taxonomyTag2: string
  taxonomyTag3: string
  additionalSegments?: string[]
}
interface Author {
  name: string
}
interface CallNoteCommand {
  intervieweeName: string
  intervieweeCompany?: string
  type: string
  sourceOfInterview: string
  intervieweeEmail?: string
  linkedInProfileHref?: string
  stakeholders?: string[]
  authors?: Author[]
  attachments?: SupportingFile[]
  isAttachmentDisclaimerAccepted?: boolean
  noteTaker?: string
  companyIds: string[]
  noteHref: string
  additionalTags: string[]
}

type NoteType =
  | 'Expert call'
  | 'Investor call'
  | 'Partner call'
  | 'Conference notes'
type NoteSource =
  | 'GLG'
  | 'Thirdbridge'
  | 'Guidepoint'
  | 'RH Advise'
  | 'Mosaic'
  | 'Personal Network'
  | 'Organically Sourced (Paid)'
type NoteStakeholders =
  | 'Government'
  | 'Provider'
  | 'Payer'
  | 'Patient'
  | 'Pharma & Life Sciences'
  | 'GPOs & Distribution'
  | 'Med Devices & Tech'
type NoteCompany = Partial<CompanySummary>
interface CallNoteSummary extends BaseResponse {
  id: string
  intervieweeName: string
  intervieweeCompany: string
  intervieweeEmail: string
  noteTaker: string
  type: NoteType
  sourceOfInterview: NoteSource
  title: string
  authors: string[]
  companyIds: string[]
  companies: NoteCompany[]
  linkedInProfileHref: string
  additionalTags: string[]
  attachments: SupportingFile[]
  noteRaw: string
  noteHref: string
  isAttachmentDisclaimerAccepted: boolean
  stakeholders: NoteStakeholders[]
  associatedEntities: string[]
  highlightedText: {
    title: string
  }
  teamRole: string
  taxonomyTag1: string
  taxonomyTag2: string
  taxonomyTag3: string
  canAccess: boolean
}
interface CEODirectoryMember {
  email: string
  givenName?: string
  familyName?: string
  company: {
    id?: string
    name?: string
    stage: string
    description?: string
    href?: string
    fundraiseStatus: { value: string; displayName: string }
  }
}
interface CEOSummary extends BaseResponse {
  member: CEODirectoryMember
  businessType: { value: string; displayName: string }
  location: string
  marketServiceArea: string[]
  customerSegment: { value: string; displayName: string }[]
  healthcareSector: { value: string; displayName: string }
  businessFocusArea: { value: string; displayName: string }[]
  pictureHref: string
  bio: string
  additionalInfo: string
  visible: { value: string; displayName: string }
  linkedinHref: string
  id: string
}
interface CEOCommand {
  email?: string
  pictureHref?: string
  businessType?: string
  location?: string
  marketServiceArea?: string[]
  customerSegment?: string[]
  businessFocusArea?: string[]
  healthcareSector?: string
  bio?: string
  additionalInfo?: string
  linkedinHref?: string
  visible?: string
}
