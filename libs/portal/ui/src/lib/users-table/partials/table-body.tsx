import { MdOutlineEdit, MdOutlineTheaterComedy } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { formatDate } from '@redesignhealth/portal/utils'
import {
  AvatarRoot,
  AvatarFallback,
  AvatarImage,
  Badge,
  Box,
  Flex,
  IconButton,
  Tbody,
  Td,
  Text,
  Tr,
  Wrap,
  WrapItem
} from '@redesignhealth/ui'

import { type UserData } from '../users-table'

interface TableBodyProps {
  tableData: Array<UserData>
  isSuperAdmin: boolean
  handleImpersonatedEmail: (user: { email: string }) => void
  onClickEditUser: (email: string) => void
}
const TableBody = ({
  tableData,
  isSuperAdmin,
  handleImpersonatedEmail,
  onClickEditUser
}: TableBodyProps) => {
  return (
    <Tbody
      fontSize="14px"
      lineHeight="20px"
      fontWeight="normal"
      color="gray.500"
    >
      {tableData.map(user => (
        <Tr key={user.email}>
          <Td>
            <Flex gap="12px">
              <AvatarRoot
                name={user.name}
                boxSize="10"
                bg="primary.200"
                color="gray.500"
              >
                {/* @ts-expect-error Chakra v3 compound component typing */}
                <AvatarImage src={user.pictureSrc} />
                <AvatarFallback />
              </AvatarRoot>
              <Box whiteSpace="normal">
                <Text color="gray.900">{user.name}</Text>
                <Text>{user.email}</Text>
              </Box>
            </Flex>
          </Td>
          <Td>
            <Text>{user.userType}</Text>
          </Td>
          <Td>
            <Text whiteSpace="pre-line">{formatDate(user.dateAdded)}</Text>
          </Td>
          <Td>
            <Wrap>
              {user?.companies?.map(co => (
                <WrapItem key={co.id}>
                  <Badge
                    colorPalette="primary"
                    size="sm"
                    variant="subtle"
                    asChild
                  >
                    <RouterLink to={`/companies/${co.id}`}>
                      {co.name}
                    </RouterLink>
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Td>
          <Td>
            <IconButton
              aria-label={`Edit ${user.name}'s details`}
              onClick={() => onClickEditUser(user.email)}
              variant="ghost"
              title="Edit"
              colorPalette="primary"
            >
              <MdOutlineEdit />
            </IconButton>
          </Td>
          {isSuperAdmin && (
            <Td>
              <IconButton
                title="Impersonate"
                aria-label={`Impersonate ${user.name}`}
                onClick={() => handleImpersonatedEmail(user)}
                variant="ghost"
                colorPalette="primary"
              >
                <MdOutlineTheaterComedy />
              </IconButton>
            </Td>
          )}
        </Tr>
      ))}
    </Tbody>
  )
}
export default TableBody
