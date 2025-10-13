import { printPersonName } from '@redesignhealth/portal/utils'
import { Link, Text } from '@redesignhealth/ui'
/*
 * If the user is a Buyer, only release Seller information if releasedDate is set
 * If the user is a Seller, only release Buyer information if the releaseDate is set
 * The releaseDate is set when the Seller clicks on the Release info button for the request
 */
interface BuyerSellerDetailsReleaseViewProps {
  releasedDate?: string
  buyerSeller?: {
    givenName?: string
    familyName?: string
    email?: string
    companyName: string
  }
}

export const BuyerSellerDetailsReleaseView = ({
  releasedDate,
  buyerSeller
}: BuyerSellerDetailsReleaseViewProps) => {
  return (
    buyerSeller &&
    (releasedDate ? (
      <>
        <Text>{printPersonName(buyerSeller)}</Text>
        <Text>{buyerSeller.companyName}</Text>
        <Link href={`mailto:${buyerSeller.email}`}>{buyerSeller.email}</Link>
      </>
    ) : (
      <Text>Someone at {buyerSeller.companyName}</Text>
    ))
  )
}
