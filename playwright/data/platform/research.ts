import { faker } from '@faker-js/faker'
import { PLATFORM_USERS } from '../../data/platform/users'

const TEAM_ROLE = ['Advisory', 'External', 'In-house']
const RESEARCH_SERVICES = [
  'Archetype identification',
  'Churn analysis',
  'Concept test',
  'Customer satisfaction (CSAT) analysis',
  'Feature prioritization',
  'Funnel optimization',
  'General insights',
  'Growth insights',
  'Hypothesis in/Validation',
  'Iterative prototype test',
  'Landing page test',
  'Landscape mapping',
  'Literature review',
  'Market segment',
  'Naming test',
  'New feature development',
  'New promoter score (NPS) analysis',
  'Opportunity identification',
  'Pain point identification',
  'Pricing analysis',
  'Usability test',
  'User journey mapping',
  'Value prop test',
  'Website audit',
  '"How might we" Workshop'
]
const SEGMENTS = [
  'Government',
  'Provider',
  'Payer',
  'Patient',
  'Pharma & Life Sciences',
  'GPOs & Distribution',
  'Med Devices & Tech',
  'Other'
]
export function fakeResearchData(id, companyId = null): ResearchCommand {
  return {
    title: `Test: Research ${id}`,
    authors: [PLATFORM_USERS.coUser.email],
    objectives: faker.lorem.words({ min: 1, max: 5 }),
    services: [
      faker.lorem.words({ min: 1, max: 5 }),
      faker.lorem.words({ min: 1, max: 5 })
    ],
    methods: [
      faker.lorem.words({ min: 1, max: 5 }),
      faker.lorem.words({ min: 1, max: 5 })
    ],
    segments: [
      faker.lorem.words({ min: 1, max: 5 }),
      faker.lorem.words({ min: 1, max: 5 })
    ],
    supportingFiles: [
      {
        href: faker.internet.url(),
        name: 'report_url'
      }
    ],
    companyId: companyId
  } as ResearchCommand
}
