import { faker } from '@faker-js/faker'
import {
  ResearchSprintCardProps,
  ResearchSprintWithId
} from '@redesignhealth/portal/data-assets'

faker.seed(123)

export const sprints = {
  content: Array.from({ length: 50 }, () => {
    const groupType = faker.helpers.arrayElement([
      'newco',
      'company',
      'concept',
      'theme'
    ]) as ResearchSprintCardProps['groupType']

    let groupName = faker.company.name()
    if (groupType === 'concept' || groupType === 'theme') {
      groupName = faker.company.buzzAdjective()
    }

    const result: ResearchSprintWithId = {
      id: faker.string.uuid(),
      groupType: groupType,
      groupName: groupName,
      groupDescription: faker.lorem.lines(5),
      isConflict: faker.datatype.boolean(),
      method: faker.company.buzzVerb(),
      reportLink: faker.internet.url(),
      objectives: faker.helpers.multiple(faker.company.catchPhrase, {
        count: { min: 1, max: 5 }
      }),
      segments: faker.helpers.multiple(faker.company.buzzNoun, {
        count: { min: 1, max: 5 }
      }),
      services: faker.helpers.multiple(faker.company.catchPhraseNoun, {
        count: { min: 1, max: 4 }
      }),
      title: faker.company.catchPhrase(),
      sprintAuthor: faker.person.fullName(),
      sprintDate: faker.date
        .between({ from: '1/1/2016', to: '12/31/2022' })
        .toLocaleDateString(undefined, { dateStyle: 'short' }),
      supportingFiles: faker.helpers
        .multiple(faker.internet.url, { count: { min: 2, max: 7 } })
        .map(link => ({ name: faker.company.catchPhrase(), link })),
      taxonomy: faker.helpers.multiple(faker.company.catchPhraseAdjective, {
        count: { min: 1, max: 4 }
      }),
      highlightedText: {}
    }
    return result
  }),
  totalResults: 50
}

export const researchSprintFilterOptions = {
  groupName: sprints?.content?.flat()?.map(s => s?.groupName),
  method: sprints?.content?.flat()?.map(s => s?.method),
  segments: sprints?.content?.flat()?.flatMap(s => s?.segments),
  services: sprints?.content?.flat()?.flatMap(s => s?.services),
  sprintAuthor: sprints?.content?.flat()?.map(s => s?.sprintAuthor),
  taxonomy: sprints?.content?.flat()?.flatMap(s => s?.taxonomy)
}
