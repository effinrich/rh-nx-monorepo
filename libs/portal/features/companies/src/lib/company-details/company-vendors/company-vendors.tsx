import { MdEdit } from 'react-icons/md'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useGetCompanyVendors } from '@redesignhealth/portal/data-assets'
import { OverviewCard, VendorCard } from '@redesignhealth/portal/ui'
import {
  Button,
  Icon,
  IconButton,
  Loader,
  Stack,
  Text
} from '@redesignhealth/ui'

const CompanyVendors = () => {
  const { companyId } = useParams()

  const { data: vendorsData, isPending: vendorsPending } =
    useGetCompanyVendors(companyId)

  return (
    <OverviewCard
      title="Your vendors"
      description="Be sure to keep this list updated if there are any changes in your engagement with vendors."
      rightElement={
        <Button
          as={RouterLink}
          colorScheme="primary"
          to={`/companies/${companyId}/vendors/add`}
        >
          Add vendor
        </Button>
      }
    >
      {vendorsPending ? (
        <Loader />
      ) : vendorsData && vendorsData.length > 0 ? (
        <Stack spacing="6">
          {vendorsData.map(vendor => (
            <VendorCard
              key={vendor.id}
              name={vendor.name}
              tags={vendor.subcategories.map(s => s.name)}
              categories={vendor.categories?.map(c => c.name) || []}
              id={vendor.id}
              contacts={vendor.contacts?.filter(
                contact => contact.willingToDiscuss
              )}
              rightAddon={
                <IconButton
                  as={RouterLink}
                  to={`${vendor.id}/edit`}
                  variant="outline"
                  aria-label="Edit company vendor"
                  icon={<Icon as={MdEdit} />}
                />
              }
            />
          ))}
        </Stack>
      ) : (
        <Text color="gray.600">
          No vendors added yet. Once you've engaged a vendor, please tell us a
          little about them by adding them to your Vendors list.
        </Text>
      )}
    </OverviewCard>
  )
}

export default CompanyVendors
