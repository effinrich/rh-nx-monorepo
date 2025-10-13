import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router-dom'
import {
  IP_MARKETPLACE_DEFAULT_VALUES,
  IP_MARKETPLACE_SORT_OPTIONS,
  IPSearchValues,
  useGetIPs,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import {
  getCompanyMemberRole,
  selectTransformer
} from '@redesignhealth/portal/utils'
import {
  Box,
  Button,
  Flex,
  HStack,
  Loader,
  SectionHeader,
  Text,
  VStack
} from '@redesignhealth/ui'
import { Select } from 'chakra-react-select'

import { NoSearchResults } from '../../../no-search-results/no-search-results'
import Pagination from '../../../pagination/pagination'
import { BuyerSellerDetailsReleaseView } from '../partials/buyer-seller-details-release-view'
import { DetailsOfRequestReleaseView } from '../partials/details-of-request-release-view'
import { SellerReleaseAction } from '../partials/seller-release-action'

import IPCard from './../ip-card/ip-card'
import IPFilterBox from './../ip-filter-box/ip-filter-box'

export const MyRequestsPage = () => {
  const methods = useForm<IPSearchValues>({
    defaultValues: IP_MARKETPLACE_DEFAULT_VALUES
  })

  const [currentPage, setCurrentPage] = useState(0)

  const { data: userInfo } = useGetUserInfo()
  const currentCompanyMemberRole = getCompanyMemberRole(userInfo?.memberOf)

  const { data: ips, isPending: isGetIpsPending } = useGetIPs(
    methods.watch(),
    currentPage,
    ['requests', 'metrics'],
    true,
    userInfo,
    true
  )

  const isEnterpriseBuyer = currentCompanyMemberRole === 'MARKETPLACE_BUYER'
  const isEnterpriseSeller = currentCompanyMemberRole === 'MARKETPLACE_SELLER'

  return (
    <Box as="section" w="full">
      <SectionHeader pb={6} title="My Requests" isDivider={false} />
      <Flex direction="column" gap="6">
        <FormProvider {...methods}>
          <IPFilterBox />
        </FormProvider>
        {isGetIpsPending ? (
          <Loader />
        ) : (
          <>
            <Flex justifyContent="space-between">
              <VStack align="left">
                <Text
                  fontWeight="600"
                  lineHeight={6}
                  fontSize="md"
                  color="gray.800"
                >
                  Results: {ips?.page.totalElements}
                </Text>
              </VStack>
              <HStack spacing={4}>
                <Text whiteSpace="nowrap" color="gray.600" fontSize={14}>
                  Sort by
                </Text>
                <Controller
                  name="sort"
                  control={methods.control}
                  render={({ field: { onChange, value, name, ref } }) => (
                    <Select
                      name={name}
                      ref={ref}
                      size="sm"
                      onChange={newValue =>
                        onChange(selectTransformer.output(newValue))
                      }
                      value={selectTransformer.input(
                        IP_MARKETPLACE_SORT_OPTIONS,
                        value
                      )}
                      options={IP_MARKETPLACE_SORT_OPTIONS}
                    />
                  )}
                />
              </HStack>
            </Flex>
            {ips &&
              ips.content.map((ip, index) => (
                <IPCard
                  key={ip.id + index}
                  id={ip.id}
                  name={ip.name}
                  rightElement={
                    <Button
                      as={RouterLink}
                      to={`/ip-marketplace/${ip.id}`}
                      variant="outline"
                      width={['100%', '100%', 'initial']}
                    >
                      View details
                    </Button>
                  }
                  organizationType={
                    ip.organization?.organizationType?.displayName
                  }
                  region={ip.organization?.region?.displayName}
                  specialities={ip.speciality?.map(element => {
                    return element.displayName
                  })}
                  disease={ip.disease}
                  organOfFocus={ip.organOfFocus.map(element => {
                    return element.displayName
                  })}
                  technologyTypes={ip.technologyType.map(element => {
                    return element.displayName
                  })}
                  executiveSummary={ip.executiveSummary}
                  requestCount={ip.metrics?.requestCount}
                  viewCount={ip.metrics?.viewCount}
                  sellerAddOn={
                    isEnterpriseBuyer &&
                    ip.requestContactInfo && (
                      <BuyerSellerDetailsReleaseView
                        buyerSeller={
                          ip.requestContactInfo[0].sellerInfo // hooks.ts is handling creating separate ip records for each buyer request, so a single valued array will be returned
                        }
                        releasedDate={ip.requestContactInfo[0].dateRelease}
                      />
                    )
                  }
                  buyerAddOn={
                    isEnterpriseSeller &&
                    ip.requestContactInfo && (
                      <BuyerSellerDetailsReleaseView
                        buyerSeller={
                          ip.requestContactInfo[0].buyerInfo // API will only return info related to this buyer user, so it will be a single valued array
                        }
                        releasedDate={ip.requestContactInfo[0].dateRelease}
                      />
                    )
                  }
                  detailsOfRequestAddOn={
                    ip.requestContactInfo && (
                      <DetailsOfRequestReleaseView
                        dateRequest={ip.requestContactInfo[0].dateRequest}
                        dateRelease={ip.requestContactInfo[0].dateRelease}
                      />
                    )
                  }
                  detailsOfRequestRightElement={
                    isEnterpriseSeller &&
                    ip.requestContactInfo && (
                      <SellerReleaseAction
                        dateRelease={ip.requestContactInfo[0].dateRelease}
                        buyerEmail={ip.requestContactInfo[0].buyerInfo.email}
                        ipListingId={ip.id}
                      />
                    )
                  }
                />
              ))}
            {ips && ips.page.totalPages > 0 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={ips.page.totalPages}
                handlePageChange={setCurrentPage}
              />
            ) : (
              <NoSearchResults searchName="requests" />
            )}
          </>
        )}
      </Flex>
    </Box>
  )
}

export default MyRequestsPage
