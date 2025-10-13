import { Vendor } from '../../vendors/types'

export const mockVendor: Vendor = {
  name: 'Apple',
  contacts: [
    {
      email: 'matt.stephenson@redesignhealth.com',
      givenName: 'Matt',
      familyName: 'Stephenson',
      willingToDiscuss: true
    }
  ],
  subcategories: [
    {
      category: {
        apiId: 'Lc7wHHLS',
        name: 'IT Ops'
      },
      apiId: 'ehhrY5fm',
      name: 'Hardware'
    },
    {
      category: {
        apiId: 'yX3IKynl',
        name: 'Infrastructure'
      },
      apiId: 'noAMWq1r',
      name: 'Electronics / Software'
    }
  ],
  pricing: '$3750/month for up to 35k patients',
  apiId: 'wgW8NSeD',
  vendorType: {
    displayName: 'Vendor',
    value: 'VENDOR'
  },
  vendorPointContact: 'matt.stephenson@redesignhealth.com',
  description:
    'Manufacturer of consumer electronics and provider of software and online services.',
  pros: 'Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.',
  cons: 'Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. ',
  discountInfo: 'Risus pretium scelerisque egestas in',
  feedbackFromOpCos: 'Odio consectetur feugiat in penatibus posuere.',
  features: 'Viverra adipiscing hendrerit magna a a odio ac.',
  hasPlatformAgreement: false,
  created: '2023-10-18T18:04:04.872739Z',
  lastModified: '2023-10-31T20:22:15.144010Z',
  links: []
}

export default mockVendor
