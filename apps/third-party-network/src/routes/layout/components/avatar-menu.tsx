import {
  MenuRoot,
  MenuTrigger,
  MenuItem,
  MenuContent
} from '@chakra-ui/react'
import { useCurrentUserQuery } from '@redesignhealth/third-party-network/features/authentication'
import { removeUserAccessToken } from '@redesignhealth/third-party-network/utils'
import { Avatar, Box } from '@redesignhealth/ui'

export const AvatarMenu = () => {
  const { data, refetch } = useCurrentUserQuery()

  const handleLogout = () => {
    removeUserAccessToken()
    refetch()
  }

  return (
    <Box ml="auto" w="fit-content" mb="8">
      <MenuRoot>
        <MenuTrigger asChild>
          <Box as="button" cursor="pointer">
            <Avatar
              name={`${data?.firstName} ${data?.lastName}`}
              size="sm"
              bg="gray.600"
              color="white"
            />
          </Box>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="logout" onClick={handleLogout}>Log Out</MenuItem>
        </MenuContent>
      </MenuRoot>
    </Box>
  )
}
