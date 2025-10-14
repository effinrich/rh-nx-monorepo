import { Link as RouterLink } from 'react-router-dom'
import { Button } from '@redesignhealth/ui'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import { BuyerSellerDetailsReleaseView } from '../partials/buyer-seller-details-release-view'
import { DetailsOfRequestReleaseView } from '../partials/details-of-request-release-view'

import { IPCard, IPCardProps } from './ip-card'

const Story: Meta<typeof IPCard> = {
  component: IPCard,
  title: 'Components / IP Card',
  decorators: [withRouter],
  args: {
    id: 'D0CuB24u'
  } as IPCardProps
}

export default Story

export const Default = {
  args: {
    name: 'Marvelous Idea',
    organizationType: 'Startup',
    region: 'Northeast',
    specialities: ['Neurology', 'Physiology'],
    disease: 'Sleep disorder',
    organOfFocus: ['Brain', 'Ear'],
    technologyTypes: ['Diagnostic Tools', 'Algorithms and Analytics'],
    executiveSummary:
      "New headset for test that records the brain's electrical response to visual, auditory, and sensory stimuli.",
    viewCount: 10,
    requestCount: 5
  }
}

export const SellerView = {
  args: {
    ...Default.args,
    sellerAddOn: (
      <BuyerSellerDetailsReleaseView
        buyerSeller={{ companyName: 'Avalanche' }}
      />
    ),
    detailsOfRequestAddOn: (
      <DetailsOfRequestReleaseView dateRequest="2023-11-01T15:12:59.605Z" />
    ),
    detailsOfRequestRightElement: (
      <Button variant="outline">Release info</Button>
    )
  }
}

export const BuyerView = {
  args: {
    ...Default.args,
    viewCount: undefined,
    requestCount: undefined,
    buyerAddOn: (
      <BuyerSellerDetailsReleaseView
        buyerSeller={{
          givenName: 'Sazh',
          familyName: 'Katzroy',
          companyName: 'Avalanche',
          email: 'sazh.katzroy@redesignhealth.com'
        }}
        releasedDate="2023-11-02T15:12:59.605Z"
      />
    ),
    detailsOfRequestAddOn: (
      <DetailsOfRequestReleaseView
        dateRelease="2023-11-02T15:12:59.605Z"
        dateRequest="2023-11-01T15:12:59.605Z"
      />
    )
  }
}

export const IpListingRequestReleasedView = {
  args: {
    buyerAddOn: (
      <BuyerSellerDetailsReleaseView
        buyerSeller={{
          givenName: 'Sazh',
          familyName: 'Katzroy',
          companyName: 'Avalanche',
          email: 'sazh.katzroy@redesignhealth.com'
        }}
        releasedDate="2023-11-02T15:12:59.605Z"
      />
    ),
    detailsOfRequestAddOn: (
      <DetailsOfRequestReleaseView
        dateRelease="2023-11-02T15:12:59.605Z"
        dateRequest="2023-11-01T15:12:59.605Z"
      />
    )
  }
}

export const IpListingRequestUnreleasedView = {
  args: {
    buyerAddOn: (
      <BuyerSellerDetailsReleaseView
        buyerSeller={{ companyName: 'Avalanche' }}
        releasedDate={undefined}
      />
    ),
    detailsOfRequestAddOn: (
      <DetailsOfRequestReleaseView dateRequest="2023-11-01T15:12:59.605Z" />
    ),
    detailsOfRequestRightElement: (
      <Button variant="outline">Release info</Button>
    )
  }
}

export const WithRightElementAsTertiaryButton = {
  args: {
    ...Default.args,
    rightElement: (
      <Button
        as={RouterLink}
        to={`/ip-marketplace/${Story.args?.id}`}
        size="sm"
        variant="outline"
      >
        View details
      </Button>
    )
  }
}
