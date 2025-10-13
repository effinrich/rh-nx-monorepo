import { Button } from '@redesignhealth/ui'

import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/react'

import { VendorCard, VendorCardProps } from './vendor-card'

const Story: Meta<typeof VendorCard> = {
  component: VendorCard,
  title: 'Components/VendorCard',
  args: {
    name: 'Apple Inc',
    type: 'Vendor',
    categories: ['Technology'],
    tags: ['Hardware'],
    contacts: [
      {
        givenName: 'Terra',
        familyName: 'Branford',
        email: 'terra.branford@example.com'
      }
    ],
    rightAddon: <Button colorScheme="primary">View Profile</Button>
  }
}
export default Story

export const Default = {
  args: {}
}

export const WithCustomRightAddon = {
  args: {
    ...Default.args,
    rightAddon: (
      <Button onClick={action('rightAddon-clicked')} colorScheme="whatsapp">
        Click Me
      </Button>
    )
  }
}

export const WithoutContacts = {
  args: {
    ...Default.args,
    contacts: []
  },
  render: (args: VendorCardProps) => (
    <VendorCard
      {...args}
      rightAddon={<Button colorScheme="primary">View Profile</Button>}
    />
  )
}

export const ManyValues = {
  args: {
    name: 'Vendor 1',
    categories: ['Technology', 'Category 2', 'Category 3'],
    tags: ['Tag 1', 'Tag 2'],
    contacts: new Array(6).fill({
      givenName: 'Jane',
      familyName: 'Doe',
      email: 'example@example.com'
    })
  }
}

export const ManyValuesWithManyContacts = {
  args: {
    name: 'Vendor Name',
    type: 'Vendor Type',
    categories: ['Category 1', 'Category 2'],
    tags: ['Tag A', 'Tag B'],
    contacts: [
      { givenName: 'John', familyName: 'Doe', email: 'johndoe@example.com' },
      { givenName: 'Jane', familyName: 'Doe', email: 'janedoe@example.com' }
    ],
    rightAddon: <Button colorScheme="primary">View Profile</Button>
  }
}
