import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { MdLock } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  CeoSearchValues,
  useGetCeos,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import { HasRole } from '@redesignhealth/portal/utils'
import {
  Box,
  Button,
  Flex,
  Loader,
  SectionHeader,
  Text
} from '@redesignhealth/ui'

import { BannerAlert } from '../../banner-alert/banner-alert'
import { NoSearchResults } from '../../no-search-results/no-search-results'
import Pagination from '../../pagination/pagination'

import { CeoCard } from './ceo-card/ceo-card'
import CeoFilterBox from './ceo-filter-box/ceo-filter-box'

export interface CeoDirectoryPageProps {
  isCeoOptOut?: boolean
  ceoId?: string
}

export const CeoDirectoryPage = ({
  isCeoOptOut,
  ceoId
}: CeoDirectoryPageProps) => {
  const formMethods = useForm<CeoSearchValues>({
    defaultValues: {
      query: '',
      fundraiseStatusFilter: [],
      businessFocusAreaFilter: [],
      businessTypeFilter: [],
      customerSegmentFilter: [],
      healthcareSectorFilter: [],
      sort: 'member.email,asc'
    }
  })

  const [currentPage, setCurrentPage] = useState(0)
  const { data: ceos, isPending } = useGetCeos(
    formMethods.watch(),
    currentPage,
    ['highlightedText']
  )
  const { data: user } = useGetUserInfo()
  const query = formMethods.watch('query')

  useEffect(() => {
    if (!query) {
      formMethods.setValue('sort', 'member.email,asc')
    } else {
      formMethods.setValue('sort', undefined)
    }
  }, [formMethods, query])

  return (
    <Box as="section" w="full">
      {isCeoOptOut && (
        <BannerAlert
          icon={MdLock}
          rightElement={
            <Button as={RouterLink} to="/ceo-directory/onboarding" size="sm">
              Opt-in now
            </Button>
          }
        >
          <Text>
            Certain details are restricted from you until you have opted-in.
          </Text>
        </BannerAlert>
      )}
      <Box>
        <SectionHeader
          title="CEO Directory"
          isDivider={false}
          rightElement={
            <>
              <HasRole
                currentRole={user?.role?.authority}
                allowed={['ROLE_SUPER_ADMIN', 'ROLE_RH_ADMIN']}
              >
                <Button colorScheme="primary" as={RouterLink} to="add">
                  Add CEO
                </Button>
              </HasRole>
              {ceoId && (
                <Button variant="outline" as={RouterLink} to={ceoId}>
                  View my profile
                </Button>
              )}
            </>
          }
        />

        <Flex direction="column" gap={6} py={6}>
          <FormProvider {...formMethods}>
            <CeoFilterBox />
          </FormProvider>
          <Text
            fontWeight="600"
            lineHeight="24px"
            fontSize="16px"
            color="gray.800"
          >
            Results: {ceos?.page.totalElements}
          </Text>
          {isPending ? (
            <Loader />
          ) : (
            ceos?.content.map(ceo => (
              <CeoCard
                key={ceo.member.email}
                ceoEmail={ceo.member.email}
                ceoGivenName={ceo.member.givenName}
                ceoFamilyName={ceo.member.familyName}
                ceoPictureHref={ceo.pictureHref}
                company={ceo.member.company}
                location={ceo.location}
                businessFocusArea={ceo.businessFocusArea}
                businessType={ceo.businessType}
                customerSegments={ceo.customerSegment}
                healthcareSector={ceo.healthcareSector}
                id={ceo.id}
                visible={ceo.visible?.value}
                currentRole={user?.role?.authority}
                isCeoOptOut={isCeoOptOut}
                highlightedText={ceo.highlightedText}
              />
            ))
          )}
          {ceos && ceos.page.totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={ceos.page.totalPages}
              handlePageChange={setCurrentPage}
            />
          ) : (
            <NoSearchResults searchName="CEOs" />
          )}
        </Flex>
      </Box>
    </Box>
  )
}

export default CeoDirectoryPage
