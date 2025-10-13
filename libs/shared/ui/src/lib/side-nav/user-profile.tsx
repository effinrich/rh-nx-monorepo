import { MdLogout } from 'react-icons/md'

import { Avatar } from '../avatar/avatar'
import { Box } from '../box/box'
import { Flex } from '../flex/flex'
import { IconButton } from '../icon-button/icon-button'
import { Text } from '../text/text'

interface UserProfileProps {
  name: string
  image: string
  email: string
  userRole: string[]
  logOut: () => void
}

export const UserProfile = (props: UserProfileProps) => {
  const { name, image, userRole, logOut } = props
  return (
    <Flex justify="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        <Avatar name={name} src={image} boxSize="10" />
        <Box pl={2}>
          <Text color="on-accent" fontWeight="500" fontSize={14}>
            {name}
          </Text>
          <Text
            color="on-accent-muted"
            fontWeight="400"
            fontSize={14}
            textTransform="capitalize"
          >
            {userRole}
          </Text>
        </Box>
      </Box>
      <Box>
        <IconButton
          aria-label="logout"
          icon={<MdLogout />}
          variant="unstyled"
          fontSize={22}
          onClick={logOut}
        />
      </Box>
    </Flex>
  )
}
