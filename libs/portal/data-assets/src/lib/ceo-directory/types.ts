import {
  CompanyApiEnum,
  HighlightedText,
  Link,
  Option,
  ReactSelectOption
} from '../types'

export interface Ceo {
  businessType?: CompanyApiEnum
  location?: string
  marketServiceArea?: string[]
  customerSegment?: CompanyApiEnum[]
  healthcareSector?: CompanyApiEnum
  businessFocusArea?: CompanyApiEnum[]
  pictureHref?: string
  bio?: string
  additionalInfo?: string
  visible?: CompanyApiEnum
  linkedinHref?: string
  id: string
  member: {
    email: string
    givenName: string
    familyName: string
    company?: {
      id?: string
      name?: string
      stage?: string
      fundraiseStatus?: CompanyApiEnum
      href?: string
      description?: string
    }
  }
  highlightedText?: HighlightedText
  links?: Link[]
}

export interface CeoUpdateCommand
  extends Omit<
    Ceo,
    | 'businessType'
    | 'businessFocusArea'
    | 'customerSegment'
    | 'healthcareSector'
    | 'visible'
    | 'member'
    | 'id'
  > {
  businessType?: string
  customerSegment?: string[]
  healthcareSector?: string
  businessFocusArea?: string[]
  visible?: string
}

export interface CeoCreateCommand extends CeoUpdateCommand {
  email: string
}

export interface CeoSearchValues {
  query: string
  fundraiseStatusFilter: Option[]
  businessTypeFilter: Option[]
  healthcareSectorFilter: Option[]
  businessFocusAreaFilter: Option[]
  customerSegmentFilter: Option[]
  sort?: string
}

export interface CeoFormFields {
  email: Option | undefined | null
  pictureHref: string | undefined
  location: Option | undefined | null
  bio: string | undefined
  additionalInfo: string | undefined
  linkedinHref: string | undefined
  businessType: string | undefined
  customerSegment: string[] | undefined
  healthcareSector: Option | undefined | null
  businessFocusArea: ReactSelectOption[]
  marketServiceArea: Option[]
  visible?: string | undefined
}

export type CeoExpansion = 'highlightedText'
