import {
  mockCategory,
  mockGetCategories,
  mockGetVendors,
  mockVendor
} from '@redesignhealth/portal/data-assets'
import {
  fireEvent,
  mocks,
  render,
  screen,
  selectReactSelectOption,
  waitFor,
  waitForLoadingToFinish
} from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import { CompanyVendorForm } from './company-vendor-form'

describe('CompanyVendorForm', () => {
  mocks.matchMedia('any', false)
  const onSubmit = jest.fn()
  const onCancel = jest.fn()
  const server = setupServer()

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  beforeEach(() => {
    mockGetCategories(server, [mockCategory])
    mockGetVendors(server, [mockVendor])
  })

  it('shows error if `Name` not provided', async () => {
    render(
      <CompanyVendorForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={false}
      />
    )
    await waitForLoadingToFinish()
    fireEvent.blur(screen.getByLabelText('Name'))

    expect(
      await screen.findByText('Must choose one option.')
    ).toBeInTheDocument()
  })

  it('shows error if `Tags` not provided', async () => {
    render(
      <CompanyVendorForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={false}
      />
    )
    await waitForLoadingToFinish()
    fireEvent.blur(screen.getByLabelText('Tags'))

    expect(
      await screen.findByText('Must choose at least one option.')
    ).toBeInTheDocument()
  })

  it('shows error if `Engagement status` not provided', async () => {
    render(
      <CompanyVendorForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={false}
      />
    )
    await waitForLoadingToFinish()
    fireEvent.blur(screen.getByLabelText('Engagement status'))

    expect(
      await screen.findByText('Must choose one option.')
    ).toBeInTheDocument()
  })

  // Fix me: https://redesignhealth.atlassian.net/browse/PUD-1044
  it.skip('submits the full form', async () => {
    render(
      <CompanyVendorForm
        isPending={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    )
    await waitForLoadingToFinish()

    await selectReactSelectOption(screen.getByLabelText('Name'), 'Apple')
    await selectReactSelectOption(screen.getByLabelText('Tags'), 'Admin Tools')
    await selectReactSelectOption(
      screen.getByLabelText('Engagement status'),
      'Active'
    )

    fireEvent.click(screen.getByLabelText('Yes'))
    fireEvent.blur(screen.getByLabelText('Yes'))

    await waitFor(() =>
      expect(screen.queryByText('Save changes')).not.toBeDisabled()
    )

    fireEvent.submit(screen.getByRole('form'))
    await waitFor(() => {
      expect(onSubmit).toBeCalledWith({
        engagementStatus: 'ACTIVE',
        name: 'Apple',
        subcategories: [
          {
            apiId: 'Zn17uxiy',
            category: {
              apiId: '1KlMnh9a',
              name: 'Infrastructure'
            },
            name: 'Admin Tools'
          }
        ],
        vendorType: '',
        willingToDiscuss: true
      })
    })
  })
})
