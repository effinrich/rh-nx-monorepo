import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
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
      <Menu autoSelect={false}>
        <MenuButton>
          <Avatar
            name={`${data?.firstName} ${data?.lastName}`}
            size="sm"
            bg="gray.600"
            color="white"
          />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleLogout}>Log Out</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
