import { mockVendor } from '@redesignhealth/portal/data-assets'
import { getVendorCategories } from '@redesignhealth/portal/data-assets'
import { render, screen } from '@redesignhealth/shared-utils-jest'
import { within } from '@testing-library/react'

import { default as VendorDetailsPage } from './vendor-details-page'

const data = {
  ...mockVendor,
  categories: getVendorCategories(mockVendor)
}

describe('Vendor Details Page', () => {
  it('shows edit button, if can edit', () => {
    render(<VendorDetailsPage data={data} canEdit />)
    expect(screen.getByLabelText('Edit vendor')).toBeInTheDocument()
  })

  it('hides edit button, if cannot edit', () => {
    render(<VendorDetailsPage data={data} canEdit={false} />)
    expect(screen.queryByLabelText('Edit vendor')).not.toBeInTheDocument()
  })

  it('renders details', () => {
    const categoriesExpected = ['IT Ops', 'Infrastructure']
    const subcategoriesExpected = ['Hardware', 'Electronics / Software']
    const companyContactsExpected = [
      { name: 'Matt Stephenson', email: 'matt.stephenson@redesignhealth.com' }
    ]
    const vendorContactExpected = 'matt.stephenson@redesignhealth.com'

    const descriptionExpected =
      'Manufacturer of consumer electronics and provider of software and online services.'
    const pricingExpected = '$3750/month for up to 35k patients'
    const discountInfoExpected = 'Risus pretium scelerisque egestas in'
    const feedbackFromCompaniesExpected =
      'Odio consectetur feugiat in penatibus posuere.'
    const prosExpected =
      'Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.'
    const consExpected =
      'Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.'
    const featuresExpected = 'Viverra adipiscing hendrerit magna a a odio ac.'
    render(<VendorDetailsPage data={data} />)
    const [
      categories,
      subcategories,
      companyContacts,
      vendorContact,
      description,
      pricing,
      discountInfo,
      feedbackFromCompanies,
      pros,
      cons,
      features,
      created,
      platformAgreement
    ] = screen.getAllByRole('listitem')

    categoriesExpected.forEach(element => {
      expect(within(categories).getByText(element)).toBeInTheDocument()
    })
    subcategoriesExpected.forEach(element => {
      expect(within(subcategories).getByText(element)).toBeInTheDocument()
    })
    companyContactsExpected.forEach(element => {
      expect(
        within(companyContacts).getByText(element.name)
      ).toBeInTheDocument()
      expect(
        within(companyContacts).getByText(element.email)
      ).toBeInTheDocument()
    })

    expect(
      within(vendorContact).getByText(vendorContactExpected)
    ).toBeInTheDocument()
    expect(
      within(description).getByText(descriptionExpected)
    ).toBeInTheDocument()
    expect(within(pricing).getByText(pricingExpected)).toBeInTheDocument()
    expect(
      within(discountInfo).getByText(discountInfoExpected)
    ).toBeInTheDocument()
    expect(
      within(feedbackFromCompanies).getByText(feedbackFromCompaniesExpected)
    ).toBeInTheDocument()
    expect(within(pros).getByText(prosExpected)).toBeInTheDocument()
    expect(within(cons).getByText(consExpected)).toBeInTheDocument()
    expect(within(features).getByText(featuresExpected)).toBeInTheDocument()
    expect(within(created).getByText('10/18/2023')).toBeInTheDocument()
    expect(within(platformAgreement).getByText('No')).toBeInTheDocument()
  })
})
