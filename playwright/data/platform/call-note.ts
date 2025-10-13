import { faker } from '@faker-js/faker'
import { PLATFORM_USERS } from './users'

export const NOTE_TYPES = [
  'Expert call',
  'Investor call',
  'Partner call',
  'Conference notes'
]
export const INTERVIEW_SOURCES = [
  'GLG',
  'Thirdbridge',
  'Guidepoint',
  'RH Advise',
  'Mosaic',
  'Personal Network',
  'Organically Sourced (Paid)'
]
export const STAKEHOLDERS = [
  'Government',
  'Provider',
  'Payer',
  'Patient',
  'Pharma & Life Sciences',
  'GPOs & Distribution',
  'Med Devices & Tech'
]
export function fakeCallNoteData(companyIds?: string[]): CallNoteCommand {
  let note = {
    intervieweeName: faker.person.fullName(),
    noteTaker: PLATFORM_USERS.rhUser.email,
    type: faker.helpers.arrayElement(NOTE_TYPES),
    sourceOfInterview: faker.helpers.arrayElement(INTERVIEW_SOURCES),
    noteHref: faker.internet.url(),
    companyIds: companyIds
  } as CallNoteCommand
  // if (Math.random() < 0.5) {
  note['intervieweeCompany'] = faker.lorem
    .words({ min: 1, max: 3 })
    .replace(/(^\w|\s\w)/g, m => m.toUpperCase())
  // }
  // if (Math.random() < 0.5) {
  note['intervieweeEmail'] = faker.internet.email().toLowerCase()
  // }
  // if (Math.random() < 0.5) {
  note['linkedInProfileHref'] = faker.internet.url()
  // }
  // if (Math.random() < 0.5) {
  note['stakeholders'] = faker.helpers.arrayElements(STAKEHOLDERS)
  // }
  note['additionalTags'] = [
    faker.lorem.word({ length: { min: 5, max: 8 } }),
    faker.lorem.word({ length: { min: 5, max: 8 } }),
    faker.lorem.word({ length: { min: 5, max: 8 } })
  ]
  return note
}
