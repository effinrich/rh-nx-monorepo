export const examples = {
  'q1-a': [
    {
      header: 'Common Items:',
      items: [
        'First and last name',
        'Email address',
        'Phone number',
        'IP address',
        'Geo-location data',
        'Account ID / Sub-account ID'
      ]
    },
    {
      header: 'Uncommon Items (for reference):',
      items: [
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
    }
  ],
  'q2-a': [
    {
      header: 'Common Items:',
      items: [
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
    },
    {
      header: 'Uncommon Items (for reference):',
      items: [
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
    }
  ],
  'q3-a': [
    {
      items: [
        'Payment Transactions',
        'Payroll Information',
        'Funding Information'
      ]
    }
  ],
  'q4-a': [
    {
      items: [
        'Company name',
        'Marketing, vision, goals, offering',
        'Number of companies launched',
        'AWS pricing info',
        'Vendors contracts',
        '3rd party affiliation',
        'Business objectives'
      ]
    }
  ],
  'q5-b-comment': [
    {
      items: [
        'Stored to existing system, e.g. Kafka/SNS/SQS',
        'Database (Managed or Self Managed) or file system storage (S3)'
      ]
    }
  ],
  'q6-a': [
    {
      items: [
        'Sent to third parties for marketing purposes',
        'Sent to vendor/3rd party for reporting or troubleshooting',
        'Sent to other company entities'
      ]
    }
  ],
  'q6-b': [
    {
      items: [
        'Transmission via email or file transfer service',
        'Direct integration via API'
      ]
    }
  ]
}

export const defaultFormRadioGroupOptions = [
  { value: 'Yes' },
  { value: 'No' },
  { value: 'It depends' },
  { value: 'Not sure' }
]

export const ACCORDION_TITLE = 'Show me examples'
export const ACCORDION_EXPANDED_TITLE = 'Hide examples'
export const TEXTAREA_PLACEHOLDER =
  'Add a comment if your response was "It depends" or "Not sure"'
export const TEXTAREA_LABEL = 'Add a comment about the previous question'

export const q3cCheckboxes = [
  'Processing In Memory Only',
  'Stored to existing system, e.g. Kafka/SNS/SQS',
  'Database (Managed or Self Managed) or file system storage (S3)',
  'Other or not sure'
]

export const q7cCheckboxes = [
  'Data processed in memory and destroyed',
  'Masked/Encrypted data written to Disk/DB/Broker',
  'Raw data written to Disk/DB/Broker',
  'Other or not sure'
]
