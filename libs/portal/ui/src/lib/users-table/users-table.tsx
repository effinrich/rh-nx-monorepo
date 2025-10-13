import { Box, Table, TableContainer } from '@redesignhealth/ui'

import TableBody from './partials/table-body'
import TableHeader from './partials/table-header'
import TotalCount from './partials/total-count'

export type UserData = {
  pictureSrc: string
  name: string
  email: string
  userType: string
  dateAdded: string
  companyName?: string
  companies?: Array<CompanyProps>
}

export type UsersTableProps = {
  usersTableData: Array<UserData>
  totalUsers: number | undefined
  onClickEditUser: (email: string) => void
  handleImpersonatedEmail: (user: { email: string }) => void
  isSuperAdmin: boolean
}

export interface CompanyProps {
  number?: number | string
  legalName?: string
  name?: string
  description?: string
  id: string
}

export const UsersTable = ({
  isSuperAdmin,
  totalUsers,
  usersTableData,
  onClickEditUser,
  handleImpersonatedEmail
}: UsersTableProps) => {
  return (
    <Box
      my={6}
      borderColor="gray.200"
      borderWidth="1px"
      borderStyle="solid"
      borderRadius="md"
    >
      <TotalCount totalUsers={totalUsers} />
      <TableContainer borderBottomRadius="8px">
        <Table
          variant="striped"
          colorScheme="gray"
          sx={{ tableLayout: { xl: 'fixed' } }}
        >
          <TableHeader />
          <TableBody
            handleImpersonatedEmail={handleImpersonatedEmail}
            isSuperAdmin={isSuperAdmin}
            tableData={usersTableData}
            onClickEditUser={onClickEditUser}
          />
        </Table>
      </TableContainer>
    </Box>
  )
}

export default UsersTable
