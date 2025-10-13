import { Helmet } from 'react-helmet'
import { MdOutlineEdit } from 'react-icons/md'
import { Link, Outlet } from 'react-router-dom'
import { VisuallyHidden } from '@chakra-ui/react'
import {
  CompanyCommand,
  useGetCompanies,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import { Page } from '@redesignhealth/portal/ui'
import { HasRole, isAdminRole } from '@redesignhealth/portal/utils'
import { formatDate } from '@redesignhealth/portal/utils'
import {
  Badge,
  Box,
  Flex,
  Icon,
  IconButton,
  Loader,
  SectionHeader,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@redesignhealth/ui'

import AddCompanyButton from '../add-company-button/add-company-button'

import { NoItemsBanner } from './partials/no-items-banner'

const Companies = () => {
  const { isPending, data: companyList } = useGetCompanies()
  const { data: currentUser } = useGetUserInfo()
  /**
   * TODO: We need to return only NEW_COs and OP_COs from the server via a filter or something.  Currently we're filtering the results locally, which throws off the page, totalElements, totalPages, etc. values that come from the server.
   */
  const filteredCompanyList = companyList?.content?.filter(() => {
    let newList

    if (isAdminRole(currentUser?.role?.authority)) {
      newList = companyList
    } else {
      newList = (co: CompanyCommand) =>
        co.stage === 'NEW_CO' || co.stage === 'OP_CO'
    }

    return newList
  })

  const companyCount = filteredCompanyList?.length

  if (isPending) {
    return <Loader />
  }

  if (companyCount === 0)
    return (
      <>
        <NoItemsBanner />
        <Outlet />
      </>
    )

  return (
    <Page>
      <Helmet>
        <title>Companies</title>
      </Helmet>
      <SectionHeader
        title="Companies"
        helpText="Manage all companies here."
        rightElement={
          <HasRole
            currentRole={currentUser?.role?.authority}
            allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN']}
          >
            <AddCompanyButton />
          </HasRole>
        }
      />
      <Box
        my={6}
        borderColor="gray.200"
        borderWidth="1px"
        borderStyle="solid"
        borderRadius="md"
      >
        <Flex align="center" px={6} py={5}>
          <Badge
            colorScheme="primary"
            size="sm"
            variant="subtle"
            textTransform="capitalize"
          >
            {companyCount} total
          </Badge>
        </Flex>

        <TableContainer borderBottomRadius="md">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th># of users</Th>
                <Th>Stage</Th>
                <Th>Date added</Th>
                <Th>Date updated</Th>
                <Th>
                  <VisuallyHidden>Edit Company</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody
              fontSize="14px"
              lineHeight="20px"
              fontWeight="normal"
              color="gray.500"
            >
              {filteredCompanyList?.map(company => (
                <Tr key={company.id}>
                  <Td>
                    {company.stage === 'NEW_CO' ||
                    company.stage === 'OP_CO' ||
                    company.isMarketplaceCompany ? (
                      <Text
                        as={Link}
                        to={`/companies/${company.id}/overview`}
                        aria-label={`${company.name} details`}
                        color="primary.700"
                      >
                        {company.name}
                      </Text>
                    ) : (
                      <Text
                        aria-label={`${company.name} details`}
                        color="gray.900"
                      >
                        {company.name}
                      </Text>
                    )}

                    <Text>{company.number}</Text>
                  </Td>
                  <Td>
                    <Badge
                      ml={[0, 1]}
                      colorScheme={
                        company?.status === 'ACTIVE' ? 'green' : 'red'
                      }
                      variant="outline"
                      size="sm"
                    >
                      {company?.status}
                    </Badge>
                  </Td>
                  <Td>{company.members?.length ?? 0}</Td>
                  <Td>{company.stage ? company.stage : 'N/A'}</Td>
                  <Td>
                    {company.created ? formatDate(company.created) : 'Unknown'}
                  </Td>
                  <Td>
                    {company.lastModified
                      ? formatDate(company.lastModified)
                      : 'N/A'}
                  </Td>
                  <Td width="50px">
                    <HasRole
                      currentRole={currentUser?.role?.authority}
                      allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN']}
                    >
                      {company.isMarketplaceCompany ? (
                        <IconButton
                          as={Link}
                          to={`/companies/${company.id}/edit-marketplace-company`}
                          aria-label={`Edit ${company.name} details`}
                          icon={<Icon as={MdOutlineEdit} />}
                          variant="ghost"
                          colorScheme="primary"
                        />
                      ) : (
                        <IconButton
                          as={Link}
                          to={`/companies/${company.id}/edit`}
                          aria-label={`Edit ${company.name} details`}
                          icon={<Icon as={MdOutlineEdit} />}
                          variant="ghost"
                          colorScheme="primary"
                        />
                      )}
                    </HasRole>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Outlet />
    </Page>
  )
}

export default Companies
