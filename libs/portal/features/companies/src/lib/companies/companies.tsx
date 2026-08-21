import { Helmet } from 'react-helmet'
import { MdOutlineEdit } from 'react-icons/md'
import { Link, Outlet } from 'react-router-dom'
import { VisuallyHidden } from '@redesignhealth/ui'
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
  TableRoot,
  TableScrollArea,
  TableBody,
  TableCell,
  Text,
  TableColumnHeader,
  TableHeader,
  TableRow
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
            colorPalette="primary"
            size="sm"
            variant="subtle"
            textTransform="capitalize"
          >
            {companyCount} total
          </Badge>
        </Flex>

        <TableScrollArea borderBottomRadius="md">
          <TableRoot variant="striped" colorPalette="gray">
            <TableHeader>
              <TableRow>
                <TableColumnHeader>Name</TableColumnHeader>
                <TableColumnHeader>Status</TableColumnHeader>
                <TableColumnHeader># of users</TableColumnHeader>
                <TableColumnHeader>Stage</TableColumnHeader>
                <TableColumnHeader>Date added</TableColumnHeader>
                <TableColumnHeader>Date updated</TableColumnHeader>
                <TableColumnHeader>
                  <VisuallyHidden>Edit Company</VisuallyHidden>
                </TableColumnHeader>
              </TableRow>
            </TableHeader>
            <TableBody
              fontSize="14px"
              lineHeight="20px"
              fontWeight="normal"
              color="gray.500"
            >
              {filteredCompanyList?.map(company => (
                <TableRow key={company.id}>
                  <TableCell>
                    {company.stage === 'NEW_CO' ||
                    company.stage === 'OP_CO' ||
                    company.isMarketplaceCompany ? (
                      <Link
                        to={`/companies/${company.id}/overview`}
                        aria-label={`${company.name} details`}
                        style={{ color: 'var(--chakra-colors-primary-700)' }}
                      >
                        <Text color="primary.700">{company.name}</Text>
                      </Link>
                    ) : (
                      <Text
                        aria-label={`${company.name} details`}
                        color="gray.900"
                      >
                        {company.name}
                      </Text>
                    )}

                    <Text>{company.number}</Text>
                  </TableCell>
                  <TableCell>
                    <Badge
                      ml={[0, 1]}
                      colorPalette={
                        company?.status === 'ACTIVE' ? 'green' : 'red'
                      }
                      variant="outline"
                      size="sm"
                    >
                      {company?.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.members?.length ?? 0}</TableCell>
                  <TableCell>{company.stage ? company.stage : 'N/A'}</TableCell>
                  <TableCell>
                    {company.created ? formatDate(company.created) : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {company.lastModified
                      ? formatDate(company.lastModified)
                      : 'N/A'}
                  </TableCell>
                  <TableCell width="50px">
                    <HasRole
                      currentRole={currentUser?.role?.authority}
                      allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN']}
                    >
                      {company.isMarketplaceCompany ? (
                        <IconButton
                          asChild
                          aria-label={`Edit ${company.name} details`}
                          variant="ghost"
                          colorPalette="primary"
                        >
                          <Link to={`/companies/${company.id}/edit-marketplace-company`}>
                            <Icon as={MdOutlineEdit} />
                          </Link>
                        </IconButton>
                      ) : (
                        <IconButton
                          asChild
                          aria-label={`Edit ${company.name} details`}
                          variant="ghost"
                          colorPalette="primary"
                        >
                          <Link to={`/companies/${company.id}/edit`}>
                            <Icon as={MdOutlineEdit} />
                          </Link>
                        </IconButton>
                      )}
                    </HasRole>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </TableScrollArea>
      </Box>
      <Outlet />
    </Page>
  )
}

export default Companies
