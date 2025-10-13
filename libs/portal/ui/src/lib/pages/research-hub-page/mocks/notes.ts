import { faker } from '@faker-js/faker'
import {
  CallNoteFilterOptions,
  CallNoteWithId
} from '@redesignhealth/portal/data-assets'

faker.seed(456)

export const notes = {
  content: [
    Array.from({ length: 50 }, () => {
      return {
        id: faker.string.uuid(),
        attachmentLink: faker.internet.url(),
        attachmentName: faker.company.catchPhrase(),
        email: faker.internet.email(),
        groupName: faker.company.name(),
        groupType: faker.helpers.arrayElement([
          'newco',
          'company',
          'concept',
          'theme'
        ]),
        intervieweeCompany: faker.company.name(),
        intervieweeName: faker.person.fullName(),
        interviewSource: faker.company.buzzNoun(),
        isConflict: faker.datatype.boolean(),
        linkedIn: faker.internet.url(),
        noteAuthor: faker.person.fullName(),
        noteDate: faker.date
          .between({ from: '1/1/2016', to: '12/31/2022' })
          .toLocaleDateString(undefined, { dateStyle: 'short' }),
        noteLink: faker.internet.url(),
        noteType: faker.animal.bird(),
        stakeholders: faker.helpers.multiple(faker.person.fullName, {
          count: { min: 1, max: 5 }
        }),
        tags: faker.helpers.multiple(faker.company.catchPhraseNoun, {
          count: { min: 1, max: 5 }
        }),
        taxonomies: faker.helpers.multiple(faker.company.catchPhraseAdjective, {
          count: { min: 1, max: 5 }
        }),
        highlightedText: {}
      } as CallNoteWithId
    })
  ],
  totalResults: 10
}

export const callNoteFilterOptions = {
  groupName: notes?.content.flat().map(s => s?.groupName),
  stakeholders: notes?.content?.flat()?.flatMap(s => s?.stakeholders),
  noteAuthor: notes?.content?.flat()?.map(s => s?.noteAuthor),
  tags: notes?.content?.flat()?.flatMap(s => s?.tags),
  taxonomies: notes?.content?.flat()?.flatMap(s => s?.taxonomies)
} as CallNoteFilterOptions
