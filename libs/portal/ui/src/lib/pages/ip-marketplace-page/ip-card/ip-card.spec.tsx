import { Link as RouterLink } from 'react-router-dom'
import { render, screen } from '@redesignhealth/shared-utils-jest'
import { Button, Text } from '@redesignhealth/ui'
import { within } from '@testing-library/react'

import IPCard from './ip-card'

describe('IPCard', () => {
  const data = {
    id: 'D0CuB24u',
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
    requestCount: 5,
    seller: {
      name: 'Sazh Katzroy',
      email: 'sazh.katzroy@redesignhealth.com'
    }
  }
  const expectedData = {
    ...data,
    specialities: 'Neurology, Physiology',
    organOfFocus: 'Brain, Ear',
    technologyTypes: 'Diagnostic Tools, Algorithms and Analytics'
  }
  it('shows all fields when all fields are provided', () => {
    render(
      <IPCard
        id="D0CuB24u"
        name={data.name}
        organizationType={data.organizationType}
        region={data.region}
        specialities={data.specialities}
        disease={data.disease}
        organOfFocus={data.organOfFocus}
        technologyTypes={data.technologyTypes}
        executiveSummary={data.executiveSummary}
        viewCount={data.viewCount}
        requestCount={data.requestCount}
      />
    )

    expect(
      within(screen.getByLabelText('Organization type')).getByText(
        expectedData.organizationType
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Region')).getByText(expectedData.region)
    ).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Specialities')).getByText(
        expectedData.specialities
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Disease')).getByText(expectedData.disease)
    ).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Organ of focus')).getByText(
        expectedData.organOfFocus
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Technology types')).getByText(
        expectedData.technologyTypes
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Executive summary')).getByText(
        expectedData.executiveSummary
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('ip-metric-view-count')).getByText('Views:')
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('ip-metric-view-count')).getByText(
        expectedData.viewCount
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('ip-metric-request-count')).getByText(
        'Requests:'
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('ip-metric-request-count')).getByText(
        expectedData.requestCount
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: 'View details' })
    ).toBeInTheDocument()
  })

  it('does not show rows where no data are provided', () => {
    render(<IPCard id="D0CuB24u" name={data.name} />)

    expect(screen.queryByText('Seller')).not.toBeInTheDocument()
    expect(screen.queryByText('Organization type')).not.toBeInTheDocument()
    expect(screen.queryByText('Region')).not.toBeInTheDocument()
    expect(screen.queryByText('Specialities')).not.toBeInTheDocument()
    expect(screen.queryByText('Disease')).not.toBeInTheDocument()
    expect(screen.queryByText('Organ of focus')).not.toBeInTheDocument()
    expect(screen.queryByText('Technology types')).not.toBeInTheDocument()
    expect(screen.queryByText('Executive summary')).not.toBeInTheDocument()
    expect(screen.queryByText('Views:')).not.toBeInTheDocument()
    expect(screen.queryByText('Requests:')).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'View details' })
    ).toBeInTheDocument()

    expect(screen.getByText(expectedData.name)).toBeInTheDocument()
    expect(
      screen.queryByText(expectedData.organizationType)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(expectedData.region)).not.toBeInTheDocument()
    expect(
      screen.queryByText(expectedData.specialities)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(expectedData.disease)).not.toBeInTheDocument()
    expect(
      screen.queryByText(expectedData.organOfFocus)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(expectedData.technologyTypes)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(expectedData.executiveSummary)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(expectedData.seller.name)).not.toBeInTheDocument()
    expect(
      screen.queryByText(expectedData.seller.email)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(expectedData.viewCount)).not.toBeInTheDocument()
    expect(
      screen.queryByText(expectedData.requestCount)
    ).not.toBeInTheDocument()
  })

  it('shows right add on element when provided', () => {
    render(
      <IPCard
        id="D0CuB24u"
        name={data.name}
        rightElement={
          <Button
            as={RouterLink}
            to={`/ip-marketplace/${data.id}`}
            size="sm"
            variant="outline"
          >
            View more
          </Button>
        }
      />
    )

    expect(screen.getByRole('link', { name: 'View more' })).toBeInTheDocument()
  })
  it('shows buyer add on element when provided', () => {
    render(
      <IPCard
        id="D0CuB24u"
        name={data.name}
        buyerAddOn={<Text>Test User</Text>}
      />
    )

    expect(
      within(screen.getByLabelText('Buyer')).getByText('Test User')
    ).toBeInTheDocument()
  })
  it('shows seller add on element when provided', () => {
    render(
      <IPCard
        id="D0CuB24u"
        name={data.name}
        sellerAddOn={<Text>Test User</Text>}
      />
    )

    expect(
      within(screen.getByLabelText('Seller')).getByText('Test User')
    ).toBeInTheDocument()
  })

  it('shows details of request add on element when provided', () => {
    render(
      <IPCard
        id="D0CuB24u"
        name={data.name}
        detailsOfRequestAddOn={
          <>
            <Text>Requested on: Oct 8th, 2023</Text>
            <Text>Released on: Not released yet</Text>
          </>
        }
        detailsOfRequestRightElement={
          <Button variant="outline">Release info</Button>
        }
      />
    )

    const detailsOfRequest = screen.getByLabelText('Details of request')
    expect(
      within(detailsOfRequest).getByText('Requested on: Oct 8th, 2023')
    ).toBeInTheDocument()
    expect(
      within(detailsOfRequest).getByText('Released on: Not released yet')
    ).toBeInTheDocument()
    expect(
      within(detailsOfRequest).getByRole('button', { name: 'Release info' })
    ).toBeInTheDocument()
  })
})
