import {
  getAdvisors,
  getData,
  getOpcoEngagementNames,
  getTaxonomyTagsText
} from '@redesignhealth/third-party-network/data-assets'

import { AdvisorList, AdvisorListData } from './types'

export const getAllAdvisors = async () => {
  const data = await getData()

  const advisors: AdvisorList = getAdvisors(data).map<AdvisorListData>(
    advisor => ({
      id: advisor.Key,
      name: advisor['Epic Name'],
      bio: advisor.Bio,
      status: advisor['RH Advise - Contract Status'],
      organization: advisor['RH Advise - Current Organization'],
      advisorRole: advisor['RH Advise - Current Role'],
      linkedIn: advisor['Profile Link'],
      categories: advisor['RH Advise - Category'],
      tags: advisor['RH Advise-Tags'],
      expertise: '',
      role: advisor['RH Advise - Current Role'],
      opcoEngagementNames: getOpcoEngagementNames(advisor, data),
      tier: advisor['RH Advise - Advisor Tier'],
      previousOrgAndRole: advisor['Previous Organization and Role'],
      taxonomyTagsText: getTaxonomyTagsText(advisor),
      opcoConflicts: advisor['OpCo Conflicts'],
      numOpcoCalls: advisor['Number of OpCo Calls']
    })
  )

  return advisors
}
