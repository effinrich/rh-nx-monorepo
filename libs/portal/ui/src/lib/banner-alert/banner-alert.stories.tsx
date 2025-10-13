import { MdLock, MdWarning } from 'react-icons/md'
import { Button, HStack, Link, Text } from '@redesignhealth/ui'

import type { Meta } from '@storybook/react'

import { BannerAlert } from './banner-alert'

const Story: Meta<typeof BannerAlert> = {
  component: BannerAlert,
  title: 'BannerAlert'
}
export default Story

export const Default = {
  args: {
    children: 'Hello, I am a banner alert!',
    icon: MdWarning
  }
}

export const CEOProfileDetails = {
  args: {
    children: (
      <Text>
        The ability to customize your own profile is coming soon! Please contact{' '}
        <Link href="mailto:platform-support@redesignhealth.com" color="inherit">
          platform-support@redesignhealth.com
        </Link>{' '}
        to make edits to your profile.
      </Text>
    ),
    icon: MdWarning
  }
}
export const CEODirectoryPage = {
  args: {
    children: (
      <HStack whiteSpace="pre-wrap">
        <Text>
          Certain details are restricted from you until you have opted-in.{' '}
        </Text>
        <Button size="sm">Opt-in now</Button>
      </HStack>
    ),
    icon: MdLock
  }
}
