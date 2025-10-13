import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import analytics from '@redesignhealth/analytics'
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
  Checkbox,
  Flex,
  HStack,
  Loader,
  SectionHeader,
  Text,
  VStack
} from '@redesignhealth/ui'
import { Select } from 'chakra-react-select'

import { NoSearchResults } from '../../no-search-results/no-search-results'
import Pagination from '../../pagination/pagination'

import IPCard from './ip-card/ip-card'
import IPFilterBox from './ip-filter-box/ip-filter-box'
export const IPMarketplacePage = () => {
  const methods = useForm<IPSearchValues>({
    defaultValues: IP_MARKETPLACE_DEFAULT_VALUES
  })

  const [currentPage, setCurrentPage] = useState(0)

  const { data: userInfo, isPending: isGetUserInfoPending } = useGetUserInfo()
  const currentCompanyMemberRole = getCompanyMemberRole(userInfo?.memberOf)

  const { data: ips, isPending: isGetIpsPending } = useGetIPs(
    methods.watch(),
    currentPage,
    ['requests'],
    methods.watch('isHideIpListings'),
    userInfo
  )

  useEffect(() => {
    if (ips) {
      analytics.sendViewItemListEvent({
        items: ips.content.map((ip, index) => ({
          item_id: ip.id,
          item_name: ip.name,
          affiliation: ip.organization.name,
          index
        }))
      })
    }
  }, [ips])

  const isEnterpriseSeller = currentCompanyMemberRole === 'MARKETPLACE_SELLER'

  return (
    <Box as="section" w="full">
      {isGetUserInfoPending ? (
        <Loader />
      ) : (
        <SectionHeader
          pb={6}
          title={isEnterpriseSeller ? 'IP Listings' : 'IP Marketplace'}
          isDivider={false}
        />
      )}
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
                <Controller
                  name="isHideIpListings"
                  control={methods.control}
                  render={({ field: { name, value, onChange } }) => (
                    <Checkbox
                      fontSize="sm"
                      name={name}
                      isChecked={value}
                      onChange={onChange}
                      gridArea="left"
                    >
                      {isEnterpriseSeller
                        ? 'Hide IP listings from other sellers in my organization'
                        : 'Hide IP listings that I requested info for'}
                    </Checkbox>
                  )}
                />
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
              ips.content.map(ip => (
                <IPCard
                  key={ip.id}
                  id={ip.id}
                  name={ip.name}
                  organizationType={
                    ip.organization?.organizationType?.displayName
                  }
                  region={ip.organization?.region?.displayName}
                  specialities={ip.speciality?.map(
                    element => element.displayName
                  )}
                  disease={ip.disease}
                  organOfFocus={ip.organOfFocus.map(
                    element => element.displayName
                  )}
                  technologyTypes={ip.technologyType.map(
                    element => element.displayName
                  )}
                  executiveSummary={ip.executiveSummary}
                />
              ))}
            {ips && ips.page.totalPages > 0 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={ips.page.totalPages}
                handlePageChange={setCurrentPage}
              />
            ) : (
              <NoSearchResults searchName="IPs" />
            )}
          </>
        )}
      </Flex>
    </Box>
  )
}

export default IPMarketplacePage
