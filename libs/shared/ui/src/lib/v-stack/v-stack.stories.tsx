import { Meta } from '@storybook/react-vite'

import { Box } from '../box/box'

import { AlignmentVStack } from './partials/alignment-v-stack'
import { NotificationListVStack } from './partials/notification-list-v-stack'
import { UserProfileVStack } from './partials/user-profile-v-stack'
import { WithDifferentSpacingVStack } from './partials/with-different-spacing-v-stack'
import { WithDividerVStack } from './partials/with-divider-v-stack'
import { VStack } from './v-stack'

export default {
  component: VStack,
  title: 'Components / Layout / VStack'
} as Meta<typeof VStack>

export const Basic = {
  args: {
    gap: '4',
    children: [
      <Box key="1" p="4" bg="primary.100" borderRadius="md">
        Item 1
      </Box>,
      <Box key="2" p="4" bg="primary.100" borderRadius="md">
        Item 2
      </Box>,
      <Box key="3" p="4" bg="primary.100" borderRadius="md">
        Item 3
      </Box>
    ]
  }
}

export const WithDifferentSpacing = {
  render: () => <WithDifferentSpacingVStack />
}

export const WithDivider = {
  render: () => <WithDividerVStack />
}

export const Alignment = {
  render: () => <AlignmentVStack />
}

export const UserProfile = {
  render: () => <UserProfileVStack />
}

export const NotificationList = {
  render: () => <NotificationListVStack />
}
