import { expect } from '@playwright/test'
import { ROLES } from '../../../../../../../../../data/platform/users'
import { testPersonGenerator } from '../../../../../../../../../utils/platform/person'
import { portalTest } from '../../../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  deleteCompany,
  testCompanyGenerator,
  addMemberToCompany
} from '../../../../../../../../../utils/platform/company'
import { impersonate } from '../../../../../../../../../utils/platform/utils'
import { deletePerson } from '../../../../../../../../../utils/platform/person'

portalTest.describe('Privacy Questionnaire', () => {
  const PRIVACY_HEADING = 'Privacy questionnaire'
  const PRIVACY_QUESTION =
    'In the context of the project, think about the possible Customer and Employee Personal Data Items and select an answer to each question. Include in comments which Data Items are required and how and why they are used if applicable.'
  const PERSONAL_QUESTION =
    'Will the service be collecting any personal information about your employees, your contractors, Redesign Health Employees, customers, partners, patients or anyone else who would be part of the system? Select one response.'
  const MEDICAL_QUESTION =
    'Will the service be collecting any medical information (Protected Health Information) about patients or system users? Select one response.'
  const FINANCIAL_QUESTION_1 =
    'Will the service be collecting any financial information about your company, Redesign Health, your partners, your patients, your employees or any other users? Select one response.'
  const FINANCIAL_QUESTION_2 =
    'Will your service be collecting any Credit Card data in any way, shape or form? Select one response.'
  const FINANCIAL_QUESTION_3 =
    'How will the financial information be stored? Select all that apply.'
  const PROPRIETARY_QUESTION =
    'Will the service be collecting any additional Proprietary information about your company, Redesign Health, your partners, your patients, your employees or any other users? Select one response.'
  const DATA_STORAGE_QUESTION_1 =
    'Is the information that is collected stored in your system? Select one response.'
  const DATA_STORAGE_QUESTION_2 =
    'If the information is stored, where will it be stored? Please provide detail, if known.'
  const DATA_SHARING_QUESTION_1 =
    'Will the information collected be transmitted outside of your system? Select one response.'
  const DATA_SHARING_QUESTION_2 =
    'If the information is transmitted outside your system, how is it done? Please provide detail, if known.'
  const AFTER_QUESTION =
    'After data is used, is it destroyed or masked when it is no longer needed? Select all that apply.'
  const RADIO_LABELS = ['Yes', 'No', 'It depends', 'Not sure']
  const RADIO_LABELS_2 = [
    'Processing In Memory Only',
    'Stored to existing system, e.g. Kafka/SNS/SQS',
    'Database (Managed or Self Managed) or file system storage (S3)',
    'Other or not sure'
  ]
  const RADIO_LABELS_3 = [
    'Data processed in memory and destroyed',
    'Masked/Encrypted data written to Disk/DB/Broker',
    'Raw data written to Disk/DB/Broker',
    'Other or not sure'
  ]
  const PLACEHOLDER_1 =
    'Add a comment if your response was "It depends" or "Not sure"'
  const PLACEHOLDER_2 = 'Add a comment with details'
  const PLACEHOLDER_3 = 'Add a comment if your response was "Other or not sure"'
  const ACCORDION_CLOSED = 'Show me examples'
  const ACCORDION_OPEN = 'Hide examples'
  const EXAMPLES_COMMON_1 = [
    'First and last name',
    'Email address',
    'Phone number',
    'IP address',
    'Geo-location data',
    'Account ID / Sub-account ID'
  ]
  const EXAMPLES_UNCOMMON_1 = [
    'MAC address (or other unique hardware identifier)',
    'Driver’s license/State ID number',
    'National identification number (e.g. SSN, Passport #’s, Taxpayer ID’s)',
    'Biometric Data (fingerprints, retinal prints, facial recognition data)',
    'Profile picture',
    'Digital identity (e.g. Online ID / Social network ID / handle)',
    'Physical address (street and city, or more granular)',
    'Payment card number',
    'Bank account number',
    'Signature'
  ]
  const EXAMPLES_COMMON_2 = [
    'Patient Names',
    'Email address',
    'Phone number',
    'IP address',
    'Geo-location data',
    'Health Insurance Insurance Policy or Account #',
    'Medical Notes',
    'Prescriptions',
    'Medical records numbers',
    'Health plan beneficiary numbers'
  ]
  const EXAMPLES_UNCOMMON_2 = [
    'Dates Related to Health',
    'Driver’s license/State ID number',
    'National identification number (e.g. SSN, Passport #’s, Taxpayer ID’s)',
    'Biometric Data (fingerprints, retinal prints, facial recognition data)',
    'Profile picture',
    'Digital identity (e.g. Online ID / Social network ID / handle)',
    'Physical address (street and city, or more granular)',
    'Payment card number',
    'Bank account number',
    'Signature'
  ]
  const EXAMPLES_FINANCIAL = [
    'Payment Transactions',
    'Payroll Information',
    'Funding Information'
  ]
  const EXAMPLES_PROPRIETARY = [
    'Company name',
    'Marketing, vision, goals, offering',
    'Number of companies launched',
    'AWS pricing info',
    'Vendors contracts',
    '3rd party affiliation',
    'Business objectives'
  ]
  const EXAMPLES_DATA_STORAGE = [
    'Stored to existing system, e.g. Kafka/SNS/SQS',
    'Database (Managed or Self Managed) or file system storage (S3)'
  ]
  const EXAMPLES_DATA_SHARING_1 = [
    'Sent to third parties for marketing purposes',
    'Sent to vendor/3rd party for reporting or troubleshooting',
    'Sent to other company entities'
  ]
  const EXAMPLES_DATA_SHARING_2 = [
    'Transmission via email or file transfer service',
    'Direct integration via API'
  ]
  let apiContext
  let person: PersonSummary
  let opco: CompanySummary

  portalTest.beforeEach(async ({ dashboard, coPage }, testInfo) => {
    const id = Date.now() + Math.floor(Math.random() * 9999)
    const coData = {
      name: `Test: Submit Infra Request ${id}`,
      number: id,
      description: `Test ${id} - submitting the privacy questionnaire and the tech stack`,
      legalName: `Test Legal Name ${id}`
    }
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    person = await testPersonGenerator(apiContext, {
      role: ROLES.rhUser.authority
    })
    opco = await testCompanyGenerator(apiContext, coData)
    let resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)

    await dashboard.goto()
    await impersonate(dashboard, person)
    await coPage.goto(opco.id)
  })

  portalTest.afterAll(async () => {
    await deletePerson(apiContext, person.email)
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  /**
   * https://redesignhealth.atlassian.net/browse/PLAT-54
   * As a user requesting an opco infrastructure be set up
   * I need to fill out a privacy questionnaire covering functionality of the
   * product to be developed
   * So that my infrastructure can be set up properly.
   * * * * * *
   * Given that I have requested opco infrastructure to be setup
   * When I see the checklist of items I need to fill out before my request is set
   * Then i am able to fill out the privacy questionnaire in an easy to use manner
   */
  portalTest('RH User can see privacy questionnaire', async ({ coPage }) => {
    const pqForm = await coPage.startPrivacy({})
    await expect.soft(pqForm.heading).toHaveText(PRIVACY_HEADING)
    await expect.soft(pqForm.heading).toBeVisible()
    await expect.soft(pqForm.subheading).toHaveText(PRIVACY_QUESTION)
    await expect.soft(pqForm.heading).toBeVisible()

    // 1. Personal Information section
    await expect
      .soft(pqForm.personalInfoSect.heading)
      .toHaveText('1. Personal information')
    await expect.soft(pqForm.personalInfoSect.heading).toBeVisible()
    await expect
      .soft(pqForm.personalInfoSect.q1.question)
      .toHaveText(PERSONAL_QUESTION)
    await expect.soft(pqForm.personalInfoSect.q1.question).toBeVisible()
    await expect.soft(pqForm.personalInfoSect.q1.radioBtnGrp.elem).toBeVisible()
    await expect
      .soft(pqForm.personalInfoSect.q1.radioBtnGrp.options)
      .toHaveText(RADIO_LABELS)
    await expect.soft(pqForm.personalInfoSect.q1.textarea).toBeVisible()
    await expect
      .soft(pqForm.personalInfoSect.q1.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_1)
    await expect.soft(pqForm.personalInfoSect.q1.accordion.elem).toBeVisible()
    await expect
      .soft(await pqForm.personalInfoSect.q1.accordion.isExpanded())
      .toBeFalsy()
    await expect.soft(pqForm.personalInfoSect.q1.accordion.button).toBeVisible()
    await expect
      .soft(pqForm.personalInfoSect.q1.accordion.button)
      .toHaveText(ACCORDION_CLOSED)
    await expect
      .soft(pqForm.personalInfoSect.q1.accordion.contents)
      .toHaveText(
        'Common Items:' +
          EXAMPLES_COMMON_1.join('') +
          'Uncommon Items (for reference):' +
          EXAMPLES_UNCOMMON_1.join('')
      )

    // 2. Medical Information section
    await expect
      .soft(pqForm.medicalInfoSect.heading)
      .toHaveText('2. Medical information')
    await expect.soft(pqForm.medicalInfoSect.heading).toBeVisible()
    await expect
      .soft(pqForm.medicalInfoSect.q1.question)
      .toHaveText(MEDICAL_QUESTION)
    await expect.soft(pqForm.medicalInfoSect.q1.question).toBeVisible()
    await expect.soft(pqForm.medicalInfoSect.q1.radioBtnGrp.elem).toBeVisible()
    await expect
      .soft(pqForm.medicalInfoSect.q1.radioBtnGrp.options)
      .toHaveText(RADIO_LABELS)
    await expect.soft(pqForm.medicalInfoSect.q1.textarea).toBeVisible()
    await expect
      .soft(pqForm.medicalInfoSect.q1.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_1)
    await expect.soft(pqForm.medicalInfoSect.q1.accordion.elem).toBeVisible()
    await expect
      .soft(await pqForm.medicalInfoSect.q1.accordion.isExpanded())
      .toBeFalsy()
    await expect.soft(pqForm.medicalInfoSect.q1.accordion.button).toBeVisible()
    await expect
      .soft(pqForm.medicalInfoSect.q1.accordion.button)
      .toHaveText(ACCORDION_CLOSED)
    await expect
      .soft(pqForm.medicalInfoSect.q1.accordion.contents)
      .toHaveText(
        'Common Items:' +
          EXAMPLES_COMMON_2.join('') +
          'Uncommon Items (for reference):' +
          EXAMPLES_UNCOMMON_2.join('')
      )

    // 3. Financial Information section
    await expect
      .soft(pqForm.financialInfoSect.heading)
      .toHaveText('3. Financial information')
    await expect.soft(pqForm.financialInfoSect.heading).toBeVisible()

    // question q3-a
    await expect
      .soft(pqForm.financialInfoSect.q1.question)
      .toHaveText(FINANCIAL_QUESTION_1)
    await expect.soft(pqForm.financialInfoSect.q1.question).toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q1.radioBtnGrp.elem)
      .toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q1.radioBtnGrp.options)
      .toHaveText(RADIO_LABELS)
    await expect.soft(pqForm.financialInfoSect.q1.textarea).toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q1.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_1)
    await expect.soft(pqForm.financialInfoSect.q1.accordion.elem).toBeVisible()
    await expect
      .soft(await pqForm.financialInfoSect.q1.accordion.isExpanded())
      .toBeFalsy()
    await expect
      .soft(pqForm.financialInfoSect.q1.accordion.button)
      .toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q1.accordion.button)
      .toHaveText(ACCORDION_CLOSED)
    await expect
      .soft(pqForm.financialInfoSect.q1.accordion.contents)
      .toHaveText(EXAMPLES_FINANCIAL.join(''))

    // question q3-b
    await expect
      .soft(pqForm.financialInfoSect.q2.question)
      .toHaveText(FINANCIAL_QUESTION_2)
    await expect.soft(pqForm.financialInfoSect.q2.question).toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q2.radioBtnGrp.elem)
      .toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q2.radioBtnGrp.options)
      .toHaveText(RADIO_LABELS)
    await expect.soft(pqForm.financialInfoSect.q2.textarea).toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q2.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_1)

    // question q3-c
    await expect
      .soft(pqForm.financialInfoSect.q3.question)
      .toHaveText(FINANCIAL_QUESTION_3)
    await expect.soft(pqForm.financialInfoSect.q3.question).toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q3.checkboxBtnGrp.elem)
      .toBeVisible()
    await expect
      .soft(pqForm.financialInfoSect.q3.checkboxBtnGrp.options)
      .toHaveText(RADIO_LABELS_2)

    // 4. Proprietary Information section
    await expect
      .soft(pqForm.proprietaryInfoSect.heading)
      .toHaveText('4. Proprietary information')
    await expect.soft(pqForm.proprietaryInfoSect.heading).toBeVisible()
    await expect
      .soft(pqForm.proprietaryInfoSect.q1.question)
      .toHaveText(PROPRIETARY_QUESTION)
    await expect.soft(pqForm.proprietaryInfoSect.q1.question).toBeVisible()
    await expect
      .soft(pqForm.proprietaryInfoSect.q1.radioBtnGrp.elem)
      .toBeVisible()
    await expect
      .soft(pqForm.proprietaryInfoSect.q1.radioBtnGrp.options)
      .toHaveText(RADIO_LABELS)
    await expect.soft(pqForm.proprietaryInfoSect.q1.textarea).toBeVisible()
    await expect
      .soft(pqForm.proprietaryInfoSect.q1.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_1)
    await expect
      .soft(pqForm.proprietaryInfoSect.q1.accordion.elem)
      .toBeVisible()
    await expect
      .soft(await pqForm.proprietaryInfoSect.q1.accordion.isExpanded())
      .toBeFalsy()
    await expect
      .soft(pqForm.proprietaryInfoSect.q1.accordion.button)
      .toBeVisible()
    await expect
      .soft(pqForm.proprietaryInfoSect.q1.accordion.button)
      .toHaveText(ACCORDION_CLOSED)
    await expect
      .soft(pqForm.proprietaryInfoSect.q1.accordion.contents)
      .toHaveText(EXAMPLES_PROPRIETARY.join(''))

    // 5. Data storage section
    await expect
      .soft(pqForm.dataStorageSect.heading)
      .toHaveText('5. Data storage')
    await expect.soft(pqForm.dataStorageSect.heading).toBeVisible()
    await expect
      .soft(pqForm.dataStorageSect.q1.question)
      .toHaveText(DATA_STORAGE_QUESTION_1)
    await expect.soft(pqForm.dataStorageSect.q1.question).toBeVisible()
    await expect.soft(pqForm.dataStorageSect.q1.radioBtnGrp.elem).toBeVisible()
    await expect
      .soft(pqForm.dataStorageSect.q1.radioBtnGrp.options)
      .toHaveText(RADIO_LABELS)
    await expect.soft(pqForm.dataStorageSect.q1.textarea).toBeVisible()
    await expect
      .soft(pqForm.dataStorageSect.q1.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_1)

    // question q5-b
    await expect
      .soft(pqForm.dataStorageSect.q2.question)
      .toHaveText(DATA_STORAGE_QUESTION_2)
    await expect.soft(pqForm.dataStorageSect.q2.question).toBeVisible()
    await expect.soft(pqForm.dataStorageSect.q2.textarea).toBeVisible()
    await expect
      .soft(pqForm.dataStorageSect.q2.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_2)
    await expect.soft(pqForm.dataStorageSect.q2.accordion.elem).toBeVisible()
    await expect
      .soft(await pqForm.dataStorageSect.q2.accordion.isExpanded())
      .toBeFalsy()
    await expect.soft(pqForm.dataStorageSect.q2.accordion.button).toBeVisible()
    await expect
      .soft(pqForm.dataStorageSect.q2.accordion.button)
      .toHaveText(ACCORDION_CLOSED)
    await expect
      .soft(pqForm.dataStorageSect.q2.accordion.contents)
      .toHaveText(EXAMPLES_DATA_STORAGE.join(''))

    // 6. Sharing data with third parties
    await expect
      .soft(pqForm.sharingDataSect.heading)
      .toHaveText('6. Sharing data with third parties')
    await expect.soft(pqForm.sharingDataSect.heading).toBeVisible()
    await expect
      .soft(pqForm.sharingDataSect.q1.question)
      .toHaveText(DATA_SHARING_QUESTION_1)
    await expect.soft(pqForm.sharingDataSect.q1.question).toBeVisible()
    await expect.soft(pqForm.sharingDataSect.q1.radioBtnGrp.elem).toBeVisible()
    await expect
      .soft(pqForm.sharingDataSect.q1.radioBtnGrp.options)
      .toHaveText(RADIO_LABELS)
    await expect.soft(pqForm.sharingDataSect.q1.textarea).toBeVisible()
    await expect
      .soft(pqForm.sharingDataSect.q1.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_1)
    await expect.soft(pqForm.sharingDataSect.q1.accordion.elem).toBeVisible()
    await expect
      .soft(await pqForm.sharingDataSect.q1.accordion.isExpanded())
      .toBeFalsy()
    await expect.soft(pqForm.sharingDataSect.q1.accordion.button).toBeVisible()
    await expect
      .soft(pqForm.sharingDataSect.q1.accordion.button)
      .toHaveText(ACCORDION_CLOSED)
    await expect
      .soft(pqForm.sharingDataSect.q1.accordion.contents)
      .toHaveText(EXAMPLES_DATA_SHARING_1.join(''))

    // question q6-b
    await expect
      .soft(pqForm.sharingDataSect.q2.question)
      .toHaveText(DATA_SHARING_QUESTION_2)
    await expect.soft(pqForm.sharingDataSect.q2.question).toBeVisible()
    await expect.soft(pqForm.sharingDataSect.q2.textarea).toBeVisible()
    await expect
      .soft(pqForm.sharingDataSect.q2.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_2)
    await expect.soft(pqForm.sharingDataSect.q2.accordion.elem).toBeVisible()
    await expect
      .soft(await pqForm.sharingDataSect.q2.accordion.isExpanded())
      .toBeFalsy()
    await expect.soft(pqForm.sharingDataSect.q2.accordion.button).toBeVisible()
    await expect
      .soft(pqForm.sharingDataSect.q2.accordion.button)
      .toHaveText(ACCORDION_CLOSED)
    await expect
      .soft(pqForm.sharingDataSect.q2.accordion.contents)
      .toHaveText(EXAMPLES_DATA_SHARING_2.join(''))

    // 7. After using data
    await expect
      .soft(pqForm.afterUsingDataSect.heading)
      .toHaveText('7. After using data')
    await expect.soft(pqForm.afterUsingDataSect.heading).toBeVisible()
    await expect
      .soft(pqForm.afterUsingDataSect.q1.question)
      .toHaveText(AFTER_QUESTION)
    await expect.soft(pqForm.afterUsingDataSect.q1.question).toBeVisible()
    await expect
      .soft(pqForm.afterUsingDataSect.q1.checkboxBtnGrp.elem)
      .toBeVisible()
    await expect
      .soft(pqForm.afterUsingDataSect.q1.checkboxBtnGrp.options)
      .toHaveText(RADIO_LABELS_3)
    await expect.soft(pqForm.afterUsingDataSect.q1.textarea).toBeVisible()
    await expect
      .soft(pqForm.afterUsingDataSect.q1.textarea)
      .toHaveAttribute('placeholder', PLACEHOLDER_3)
  })
})
