export interface Advisor {
  id?: string
  name?: string
  bio?: string
  status?: string
  organization?: string
  role?: string
  cv?: string
  linkedIn?: string
  website?: string
  categories?: Array<string>
  tags?: Array<string>
  referrerName?: string
  referallDate?: string
  expertise?: string
  opcoEngagementNames?: Array<string>
  tier?: string
  previousOrgAndRole?: string
  taxonomyTagsText?: string
  opcoConflicts?: string
  numIntroductions?: string
  firstEngagementDate?: Date
}

export interface OpcoEngagement {
  id?: string
  type?: string
  reviewDate?: string | Date
  reviewerName?: string
  reviewerExpertise?: string
  rating?: number
}
