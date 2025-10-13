import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  CompanySummary,
  useGetCompanyById,
  useGetCompanyMembers,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import { OverviewCard } from '@redesignhealth/portal/ui'
import { HasRole } from '@redesignhealth/portal/utils'
import {
  Button,
  Loader,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@redesignhealth/ui'

const getDescriptionText = (company?: CompanySummary) => {
  if (
    ['ENTERPRISE_BUYER', 'ENTERPRISE_SELLER'].some(
      type => type === company?.activityType?.value
    )
  ) {
    return `Everyone listed here has access to the Redesign Health IP Marketplace through ${company?.name}'s enterprise account.`
  }

  return `The individuals listed here encompass both employees that work at
          ${company?.name} and individuals who are part of the Redesign Health
          team that provide customer support to ${company?.name}. Contact your
          Relationship Manager to add new users, make edits, or update user
          permissions.`
}

const CompanyUsers = () => {
  const { companyId } = useParams()
  const { data: company } = useGetCompanyById(companyId)
  const { data, isPending } = useGetCompanyMembers(companyId)
  const { data: currentUser } = useGetUserInfo()
  const emptyCompanyDisplay = (
    <Text
      as="h2"
      fontSize="18px"
      lineHeight="28px"
      fontWeight="medium"
      textAlign="center"
      color="gray.900"
    >
      No users added to company yet.
    </Text>
  )

  const simpleTable = (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map(person => (
          <Tr key={person.email}>
            <Td>{`${person.givenName} ${person.familyName}`}</Td>
            <Td>{person.email}</Td>
            <Td>{person.status}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )

  return (
    <OverviewCard
      title="Users"
      description={getDescriptionText(company)}
      rightElement={
        currentUser ? (
          <HasRole
            currentRole={currentUser?.role?.authority}
            allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN']}
          >
            <Button as={RouterLink} to="add" colorScheme="primary">
              Add user
            </Button>
          </HasRole>
        ) : (
          <Loader />
        )
      }
    >
      {isPending ? (
        <Loader />
      ) : data && data.length > 0 ? (
        simpleTable
      ) : (
        emptyCompanyDisplay
      )}
    </OverviewCard>
  )
}

export default CompanyUsers
