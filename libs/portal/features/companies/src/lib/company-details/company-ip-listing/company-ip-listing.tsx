import { useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useGetIPsByCompany } from '@redesignhealth/portal/data-assets'
import { IPCard, OverviewCard, Pagination } from '@redesignhealth/portal/ui'
import { printPersonName } from '@redesignhealth/portal/utils'
import { Button, Loader, Stack, Text } from '@redesignhealth/ui'

import EmptyState from './partials/empty-state'

const CompanyIpListing = () => {
  const { companyId } = useParams()
  const [currentPage, setCurrentPage] = useState(0)
  const { data: companyIp } = useGetIPsByCompany(companyId || '', currentPage, [
    'metrics'
  ])
  return (
    <OverviewCard
      title="IP Records"
      description="Contact platform-support@redesignhealth.com to make updates to any of your IP records."
    >
      {companyIp ? (
        companyIp.page.totalElements > 0 ? (
          <Stack spacing={6}>
            {companyIp.content.map(ip => (
              <IPCard
                key={ip.id}
                id={ip.id}
                name={ip.name}
                rightElement={
                  <Button
                    as={RouterLink}
                    to={`/ip-marketplace/${ip.id}`}
                    size="sm"
                    variant="outline"
                  >
                    View details
                  </Button>
                }
                sellerAddOn={
                  ip.owner && (
                    <>
                      <Text>{printPersonName(ip.owner)}</Text>
                      <Text>{ip.owner.email}</Text>
                    </>
                  )
                }
                viewCount={ip.metrics?.viewCount}
                requestCount={ip.metrics?.requestCount}
              />
            ))}
            <Pagination
              handlePageChange={setCurrentPage}
              totalPages={companyIp.page.totalPages}
            />
          </Stack>
        ) : (
          <EmptyState />
        )
      ) : (
        <Loader />
      )}
    </OverviewCard>
  )
}

export default CompanyIpListing
