import { useCurrentUserQuery } from '@redesignhealth/third-party-network/features/authentication'
import { removeUserAccessToken } from '@redesignhealth/third-party-network/utils'
import {
  AvatarFallback,
  AvatarRoot,
  Box,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger
} from '@redesignhealth/ui'

export const AvatarMenu = () => {
  const { data, refetch } = useCurrentUserQuery()

  const handleLogout = () => {
    removeUserAccessToken()
    refetch()
  }

  const name = `${data?.firstName} ${data?.lastName}`

  return (
    <Box ml="auto" w="fit-content" mb="8">
      <MenuRoot>
        <MenuTrigger asChild>
          <Box as="button" cursor="pointer">
            <AvatarRoot size="sm" bg="gray.600" color="white">
              <AvatarFallback name={name} />
            </AvatarRoot>
          </Box>
        </MenuTrigger>
        <MenuPositioner>
          <MenuContent>
            <MenuItem value="logout" onClick={handleLogout}>
              Log Out
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>
    </Box>
  )
}
