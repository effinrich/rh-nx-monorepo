import { ConsentSummary } from '../../terms/types'

export const mockConsent: ConsentSummary = {
  type: {
    displayName: 'Terms of service',
    value: 'TERMS_OF_SERVICE'
  },
  version: 'f7170faf8d48561a00ea36adc22efc76',
  accepted: '2018-03-28T14:32:11.838Z',
  links: [
    {
      rel: 'me',
      href: 'http://localhost:8080/person/test@redesignhealth.com'
    }
  ]
}

export const mockConsentWithStaleVersion: ConsentSummary = {
  type: {
    displayName: 'Terms of service',
    value: 'TERMS_OF_SERVICE'
  },
  version: '-1',
  accepted: '2018-03-28T14:32:11.838Z',
  links: [
    {
      rel: 'me',
      href: 'http://localhost:8080/person/test@redesignhealth.com'
    }
  ]
}
