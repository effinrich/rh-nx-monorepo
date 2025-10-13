import {
  getData,
  getFirstOpcoEngagementDate,
  getOpcoEngagementNames,
  getTaxonomyTagsText
} from '@redesignhealth/third-party-network/data-assets'

import { Advisor, OpcoEngagement } from './types'

export const getAdvisor = async (advisorId: string) => {
  const data = await getData()

  const rawAdvisor = data.find(row => row.Key === advisorId)
  if (!rawAdvisor) return null

  const advisor: Advisor = {
    id: rawAdvisor.Key,
    name: rawAdvisor['Epic Name'],
    bio: rawAdvisor.Bio,
    status: rawAdvisor['RH Advise - Contract Status'],
    organization: rawAdvisor['RH Advise - Current Organization'],
    role: rawAdvisor['RH Advise - Current Role'],
    cv: rawAdvisor['RH Advise - Link to CV'],
    linkedIn: rawAdvisor['Profile Link'],
    website: rawAdvisor.Website,
    categories: rawAdvisor['RH Advise - Category'],
    tags: rawAdvisor['RH Advise-Tags'],
    referrerName: rawAdvisor['RH Employee Name'],
    referallDate: rawAdvisor['Created Date'],
    opcoEngagementNames: getOpcoEngagementNames(rawAdvisor, data),
    tier: rawAdvisor['RH Advise - Advisor Tier'],
    previousOrgAndRole: rawAdvisor['Previous Organization and Role'],
    taxonomyTagsText: getTaxonomyTagsText(rawAdvisor),
    opcoConflicts: rawAdvisor['OpCo Conflicts'],
    numIntroductions: rawAdvisor['Number of OpCo Calls'],
    firstEngagementDate: getFirstOpcoEngagementDate(rawAdvisor, data)
  }

  return advisor
}

export const getOpcoEngagements = async (
  advisorId: string,
  opcoName: string
) => {
  const data = await getData()
  const requests = data.filter(
    row =>
      (row['Issue Type'] === 'Introduction' ||
        row['Issue Type'] === 'Contract') &&
      row.parent === advisorId &&
      row['OpCo/NewCo Name'] === opcoName
  )

  return requests
    .map<OpcoEngagement>(r => ({
      id: r.Key,
      type: r['Issue Type'],
      reviewDate: r.Created,
      reviewerName: r['RH Employee Name'],
      reviewerExpertise: r['Area of Expertise - form'],
      rating: r.Rating
    }))
    .sort((a, b) => -1 * (a.type?.localeCompare(b.type ?? '') ?? 0))
}
