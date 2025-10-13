import { Locator, Page } from '@playwright/test'
import {
  Accordion,
  ChakraCheckboxGroup,
  ChakraRadioButtonGroup,
  DrawerForm
} from '../../../../components/components'

class CBQuestionBlock {
  private page: Page
  private modal: Locator
  private qIdx: string
  readonly question: Locator
  readonly checkboxBtnGrp: ChakraRadioButtonGroup
  readonly textarea: Locator
  readonly accordion: Accordion

  constructor(page: Page, modal: Locator, qIdx: string, accordionIdx) {
    this.page = page
    this.modal = modal
    this.qIdx = qIdx
    this.question = this.modal.locator(`[data-testid="${this.qIdx}-desc"]`)
    this.checkboxBtnGrp = new ChakraCheckboxGroup(
      this.modal.locator('[role="group"]', {
        has: this.page.locator(`input[name^="${this.qIdx}"]`)
      })
    )
    this.textarea = this.modal.locator(`[name="${this.qIdx}-comment"]`)
    if (accordionIdx != null) {
      // todo: catch case if there is no accordion
      this.accordion = new Accordion(
        this.modal.locator('.chakra-accordion').nth(accordionIdx)
      )
    }
  }
}

class RBQuestionBlock {
  private page: Page
  private modal: Locator
  private qIdx: string
  readonly question: Locator
  readonly radioBtnGrp: ChakraRadioButtonGroup
  readonly textarea: Locator
  readonly accordion: Accordion

  constructor(page: Page, modal: Locator, qIdx: string, accordionIdx) {
    this.page = page
    this.modal = modal
    this.qIdx = qIdx
    this.question = this.modal.locator(`[data-testid="${this.qIdx}-desc"]`)
    this.radioBtnGrp = new ChakraRadioButtonGroup(
      this.modal.locator('[role="radiogroup"]', {
        has: this.page.locator(`input[name="${this.qIdx}"]`)
      })
    )
    this.textarea = this.modal.locator(`[name="${this.qIdx}-comment"]`)
    if (accordionIdx != null) {
      // todo: catch case if there is no accordion
      this.accordion = new Accordion(
        this.modal.locator('.chakra-accordion').nth(accordionIdx)
      )
    }
  }
}
class Section {
  readonly page: Page
  readonly modal: Locator
  readonly heading: Locator

  constructor(page, modal, sectionIndex) {
    this.page = page
    this.modal = modal
    this.heading = this.modal.locator(`[data-testid="s${sectionIndex}"]`)
  }
}
class PersonalInfoSection extends Section {
  readonly q1: RBQuestionBlock

  constructor(page: Page, modal: Locator) {
    super(page, modal, 1)
    this.q1 = new RBQuestionBlock(this.page, this.modal, 'q1-a', 0)
  }
}
class MedicalInfoSection extends Section {
  readonly q1: RBQuestionBlock

  constructor(page: Page, modal: Locator) {
    super(page, modal, 2)
    this.q1 = new RBQuestionBlock(this.page, this.modal, 'q2-a', 1)
  }
}
class FinancialInfoSection extends Section {
  readonly q1: RBQuestionBlock
  readonly q2: RBQuestionBlock
  readonly q3: CBQuestionBlock

  constructor(page: Page, modal: Locator) {
    super(page, modal, 3)
    this.q1 = new RBQuestionBlock(this.page, this.modal, 'q3-a', 2)
    this.q2 = new RBQuestionBlock(this.page, this.modal, 'q3-b', null)
    this.q3 = new CBQuestionBlock(this.page, this.modal, 'q3-c', null)
  }
}
class ProprietaryInfoSection extends Section {
  readonly q1: RBQuestionBlock

  constructor(page: Page, modal: Locator) {
    super(page, modal, 4)
    this.q1 = new RBQuestionBlock(this.page, this.modal, 'q4-a', 3)
  }
}
class DataStorageSection extends Section {
  readonly q1: RBQuestionBlock
  readonly q2: RBQuestionBlock

  constructor(page: Page, modal: Locator) {
    super(page, modal, 5)
    this.q1 = new RBQuestionBlock(this.page, this.modal, 'q5-a', null)
    this.q2 = new RBQuestionBlock(this.page, this.modal, 'q5-b', 4)
  }
}
class SharingDataSection extends Section {
  readonly q1: RBQuestionBlock
  readonly q2: RBQuestionBlock

  constructor(page: Page, modal: Locator) {
    super(page, modal, 6)
    this.q1 = new RBQuestionBlock(this.page, this.modal, 'q6-a', 5)
    this.q2 = new RBQuestionBlock(this.page, this.modal, 'q6-b', 6)
  }
}
class AfterUsingDataSection extends Section {
  readonly q1: CBQuestionBlock

  constructor(page: Page, modal: Locator) {
    super(page, modal, 7)
    this.q1 = new CBQuestionBlock(this.page, this.modal, 'q7-a', null)
  }
}
export class Privacy extends DrawerForm {
  readonly personalInfoSect: PersonalInfoSection
  readonly medicalInfoSect: MedicalInfoSection
  readonly financialInfoSect: FinancialInfoSection
  readonly proprietaryInfoSect: ProprietaryInfoSection
  readonly dataStorageSect: DataStorageSection
  readonly sharingDataSect: SharingDataSection
  readonly afterUsingDataSect: AfterUsingDataSection
  readonly saveDraftBtn: Locator
  readonly doneBtn: Locator

  constructor(page: Page) {
    super(page)
    this.personalInfoSect = new PersonalInfoSection(this.page, this.modal)
    this.medicalInfoSect = new MedicalInfoSection(this.page, this.modal)
    this.financialInfoSect = new FinancialInfoSection(this.page, this.modal)
    this.proprietaryInfoSect = new ProprietaryInfoSection(this.page, this.modal)
    this.dataStorageSect = new DataStorageSection(this.page, this.modal)
    this.sharingDataSect = new SharingDataSection(this.page, this.modal)
    this.afterUsingDataSect = new AfterUsingDataSection(this.page, this.modal)
    this.saveDraftBtn = this.page.getByRole('button', { name: 'Save Draft' })
    this.doneBtn = this.page.getByRole('button', { name: 'Done' })
  }
  async fillout(input) {
    const keys = Object.keys(input).sort()
    for (const key of keys) {
      const val = input[key]
      if (key.endsWith('-comment')) {
        await this.page.locator(`[name="${key}"]`).fill(val)
      } else if (key == 'q3-c' || key == 'q7-a') {
        for (let l of val) {
          await this.page
            .locator('.chakra-checkbox', {
              has: this.page.locator(`[name^="${key}"]`)
            })
            .filter({ hasText: l })
            .click()
        }
      } else {
        await this.page
          .locator(
            `.chakra-radio-group:has([name="${key}"]) > div:has([value="${val}"])`
          )
          .click()
      }
    }
  }
  async read() {
    let data = {}
    for (const key of Q_NUMS) {
      if (key.endsWith('-comment')) {
        const val = await this.page
          .locator(`[name="${key}"]`)
          .textContent({ timeout: 500 })
        if (val != '') {
          data[key] = val
        }
      } else if (key == 'q3-c' || key == 'q7-a') {
        try {
          const vals = []
          const ansKey = key.substring(0, 2)
          for (const item of await this.page
            .locator(
              `.chakra-stack:has([name^="${ansKey}"]) .chakra-checkbox__label[data-checked]`
            )
            .all()) {
            vals.push(await item.textContent())
          }
          if (vals.length) {
            data[key] = vals.sort()
          }
        } catch (err) {
          await console.log('err:', err)
        }
      } else {
        try {
          data[key] = await this.page
            .locator(
              `.chakra-radio-group:has([name="${key}"]) > div label:has([data-checked])`
            )
            .textContent({ timeout: 500 })
        } catch (err) {
          await console.info(`no value selected for ${key}`)
        }
      }
    }
    return data
  }
}

const DEFAULT = ['Yes', 'No', 'It depends', 'Not sure']
const DATA_STORAGE = [
  'Processing In Memory Only',
  'Stored to existing system, e.g. Kafka/SNS/SQS',
  'Database (Managed or Self Managed) or file system storage (S3)',
  'Other or not sure'
]
const DATA_AFTER_USE = [
  'Data processed in memory and destroyed',
  'Masked/Encrypted data written to Disk/DB/Broker',
  'Raw data written to Disk/DB/Broker',
  'Other or not sure'
]

const Q_NUMS = [
  'q1-a',
  'q1-a-comment',
  'q2-a',
  'q2-a-comment',
  'q3-a',
  'q3-a-comment',
  'q3-b',
  'q3-b-comment',
  'q3-c',
  'q4-a',
  'q4-a-comment',
  'q5-a',
  'q5-a-comment',
  'q5-b-comment',
  'q6-a',
  'q6-a-comment',
  'q6-b-comment',
  'q7-a',
  'q7-a-comment'
]
import { faker } from '@faker-js/faker'

/**
 * Generates a random sample of data for filling out the Privacy Questionnaire
 * @param complete boolean - whether or not to generate data for all privacy
 *   questions, default=true
 * @returns Object representing Privacy data with the keys matching the privacy
 *   question element locator in the DOM and the values representing the answer
 */
export function randomPrivacyData(complete: boolean = true) {
  let sample = []
  if (!complete) {
    // get a random set of privacy questions to supply answers for
    const n = Math.floor(Math.random() * (Q_NUMS.length - 1)) + 1
    const shuff = Q_NUMS.sort(() => 0.5 - Math.random())
    sample = shuff.slice(0, n)
  } else {
    sample = Q_NUMS
  }
  let fakeData = {}
  for (const key of sample) {
    if (key === 'q3-c') {
      fakeData['q3-c'] = faker.helpers.arrayElements(DATA_STORAGE).sort()
    } else if (key === 'q7-a') {
      fakeData['q7-a'] = faker.helpers.arrayElements(DATA_AFTER_USE).sort()
    } else if (key.endsWith('-comment')) {
      fakeData[key] = faker.lorem.sentence()
    } else {
      const ans = faker.helpers.arrayElement(DEFAULT)
      fakeData[key] = ans
    }
  }

  return fakeData
}
