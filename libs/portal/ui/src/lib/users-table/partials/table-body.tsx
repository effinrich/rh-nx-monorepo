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
  TableBody as ChakraTableBody,
  TableCell,
  Text,
  TableRow,
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
    <ChakraTableBody
      fontSize="14px"
      lineHeight="20px"
      fontWeight="normal"
      color="gray.500"
    >
      {tableData.map(user => (
        <TableRow key={user.email}>
          <TableCell>
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
          </TableCell>
          <TableCell>
            <Text>{user.userType}</Text>
          </TableCell>
          <TableCell>
            <Text whiteSpace="pre-line">{formatDate(user.dateAdded)}</Text>
          </TableCell>
          <TableCell>
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
          </TableCell>
          <TableCell>
            <IconButton
              aria-label={`Edit ${user.name}'s details`}
              onClick={() => onClickEditUser(user.email)}
              variant="ghost"
              title="Edit"
              colorPalette="primary"
            >
              <MdOutlineEdit />
            </IconButton>
          </TableCell>
          {isSuperAdmin && (
            <TableCell>
              <IconButton
                title="Impersonate"
                aria-label={`Impersonate ${user.name}`}
                onClick={() => handleImpersonatedEmail(user)}
                variant="ghost"
                colorPalette="primary"
              >
                <MdOutlineTheaterComedy />
              </IconButton>
            </TableCell>
          )}
        </TableRow>
      ))}
    </ChakraTableBody>
  )
}
export default TableBody
