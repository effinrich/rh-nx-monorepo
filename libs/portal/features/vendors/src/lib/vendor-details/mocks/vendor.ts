import { Vendor } from '@redesignhealth/portal/data-assets'

export const vendor: Vendor = {
  name: 'Boomset',
  contacts: [
    {
      email: 'sazh.katzroy@redesignhealth.com',
      givenName: 'Sazh',
      familyName: 'Katzroy',
      willingToDiscuss: true
    }
  ],
  subcategories: [
    {
      category: {
        apiId: 'Lf0ED5AA',
        name: 'Infrastructure'
      },
      apiId: 'Zn17uxiy',
      name: 'Admin Tools'
    }
  ],
  pricing: '$3750/month',
  apiId: '1KlMnh9a',
  vendorType: { displayName: 'Vendor', value: 'VENDOR' },
  vendorPointContact: 'test@example.com',
  description: 'Lorem ipsum dolor sit amet consectetur.',
  pros: 'Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.',
  cons: 'Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. ',
  discountInfo: 'Risus pretium scelerisque egestas in',
  feedbackFromOpCos: 'Odio consectetur feugiat in penatibus posuere.',
  features: 'Viverra adipiscing hendrerit magna a a odio ac.',
  hasPlatformAgreement: true,
  created: '2023-10-23T21:17:20.434Z'
  // lastModified: '2023-10-23T21:17:20.434Z',
  // links: [
  //   {
  //     rel: 'string',
  //     href: 'string',
  //     hreflang: 'string',
  //     media: 'string',
  //     title: 'string',
  //     type: 'string',
  //     deprecation: 'string',
  //     profile: 'string',
  //     name: 'string'
  //   }
  // ]
}
