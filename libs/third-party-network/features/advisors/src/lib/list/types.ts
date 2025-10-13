export interface AdvisorListData {
  id?: string
  name?: string
  bio?: string
  categories?: Array<string>
  status?: string
  organization?: string
  advisorRole?: string
  linkedIn?: string
  opcoEngagementNames?: Array<string>
  tags?: Array<string>
  role?: string
  expertise?: string
  tier?: string
  previousOrgAndRole?: string
  taxonomyTagsText?: string
  opcoConflicts?: string
  numOpcoCalls?: string
}

export type AdvisorList = Array<AdvisorListData>

export type FilterName = Extract<
  keyof AdvisorListData,
  'categories' | 'tags' | 'opcoEngagementNames'
>

export type Filters = Record<FilterName, Array<string>>
