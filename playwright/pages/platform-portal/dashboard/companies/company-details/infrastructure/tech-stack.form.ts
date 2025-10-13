import { faker } from '@faker-js/faker'
import { Locator, Page } from '@playwright/test'
import { DrawerForm } from '../../../../components/components'

const DEFAULT = ['Yes', 'No']
const Q_NUMS = [
  'Artifactory-AWS ECR',
  'Artifactory-AWS ECR-comment',
  'CI-Github Actions',
  'CI-Github Actions-comment',
  'Code Repo-Github',
  'Code Repo-Github-comment',
  'Secured KV-Hashicorp - Vault',
  'Secured KV-Hashicorp - Vault-comment',
  'DNS-Route 53',
  'DNS-Route 53-comment',
  'DDOS Protection-AWS WAF',
  'DDOS Protection-AWS WAF-comment',
  'API Gateway-NGINX',
  'API Gateway-NGINX-comment',
  'CIAM (Internal)-Google + Cognito',
  'CIAM (Internal)-Google + Cognito-comment',
  'Config Management Infra-Terraform',
  'Config Management Infra-Terraform-comment',
  'Config Management Dynamic-Vault',
  'Config Management Dynamic-Vault-comment',
  'Image Orchestration-ECS',
  'Image Orchestration-ECS-comment',
  'Storage-S3',
  'Storage-S3-comment',
  'CDN-CloudFront',
  'CDN-CloudFront-comment',
  'Metrics-Cloud Watch',
  'Metrics-Cloud Watch-comment',
  'Metrics Visualization-Cloud Watch',
  'Metrics Visualization-Cloud Watch-comment',
  'Logging Visualization-Cloud Watch',
  'Logging Visualization-Cloud Watch-comment'
]

export class TechStack extends DrawerForm {
  readonly saveDraftBtn: Locator
  readonly doneBtn: Locator

  constructor(page: Page) {
    super(page)
    this.saveDraftBtn = this.page.getByRole('button', { name: 'Save Draft' })
    this.doneBtn = this.page.getByRole('button', { name: 'Done' })
  }
  async fillout(input) {
    const keys = Object.keys(input).sort()
    for (const key of keys) {
      const val = input[key]
      if (key.endsWith('-comment')) {
        await this.page.locator(`[name="${key}"]`).fill(val)
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
          .getAttribute('value', { timeout: 500 })
        if (val != '') {
          data[key] = val
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

/**
 * Generates a random sample of data for filling out the Tech Stack form
 * @param complete boolean - whether or not to generate data for all questions,
 *   default=true
 * @returns Object representing Tech Stack data with the keys matching the
 *   question element locator in the DOM and the values representing the answer
 */
export function randomTechStackData(complete: boolean = true) {
  let sample = []
  if (!complete) {
    // get a random set of tech stack questions to answer
    const n = Math.floor(Math.random() * (Q_NUMS.length - 1)) + 1
    const shuff = Q_NUMS.sort(() => 0.5 - Math.random())
    sample = shuff.slice(0, n)
  } else {
    sample = Q_NUMS
  }
  let fakeData = {}
  for (const key of sample) {
    if (key.endsWith('-comment')) {
      fakeData[key] = faker.lorem.sentence()
    } else {
      const ans = faker.helpers.arrayElement(DEFAULT)
      fakeData[key] = ans
    }
  }

  return fakeData
}
