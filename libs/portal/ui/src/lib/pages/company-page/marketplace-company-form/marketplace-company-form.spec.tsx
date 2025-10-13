import { TEXTAREA_CHARACTER_LIMIT } from '@redesignhealth/portal/utils'
import {
  changeAndBlur,
  fireEvent,
  mocks,
  render,
  screen,
  selectReactSelectOption,
  waitFor
} from '@redesignhealth/shared-utils-jest'

import MarketplaceCompanyForm from './marketplace-company-form'

describe('MarketplaceCompanyForm', () => {
  mocks.matchMedia('any', false)
  const onSubmit = jest.fn()
  const onCancel = jest.fn()
  it('shows error if `Company name` not provided', async () => {
    const onSubmit = jest.fn()
    render(<MarketplaceCompanyForm onSubmit={onSubmit} onCancel={onCancel} />)

    fireEvent.blur(screen.getByLabelText('Company name'))

    expect(await screen.findByText('Required')).toBeInTheDocument()
  })

  it('shows error if `Organization type` not provided', async () => {
    const onSubmit = jest.fn()
    render(<MarketplaceCompanyForm onSubmit={onSubmit} onCancel={onCancel} />)
    const organizationType = screen.getByLabelText('Organization type')
    fireEvent.blur(organizationType)

    expect(await screen.findByText('Required')).toBeInTheDocument()
  })

  it('shows error if `Region` not provided', async () => {
    const onSubmit = jest.fn()
    render(<MarketplaceCompanyForm onSubmit={onSubmit} onCancel={onCancel} />)
    const region = screen.getByLabelText('Region')
    fireEvent.blur(region)

    expect(await screen.findByText('Required')).toBeInTheDocument()
  })

  it('updates `Description` character count', async () => {
    const onSubmit = jest.fn()
    render(<MarketplaceCompanyForm onSubmit={onSubmit} onCancel={onCancel} />)
    expect(screen.getByText('500 characters left'))
    const description = screen.getByLabelText('Description (optional)')
    fireEvent.change(description, { target: { value: 'Text' } })
    expect(screen.getByText('496 characters left'))
  })

  it('error if `Description` greater than limit', async () => {
    const onSubmit = jest.fn()
    render(<MarketplaceCompanyForm onSubmit={onSubmit} onCancel={onCancel} />)
    const description = screen.getByLabelText('Description (optional)')
    const lotsOfText = new Array(TEXTAREA_CHARACTER_LIMIT + 2).join('.')
    fireEvent.change(description, {
      target: { value: lotsOfText }
    })
    fireEvent.blur(description)
    expect(
      await screen.findByText(
        `description must be at most ${TEXTAREA_CHARACTER_LIMIT} characters`
      )
    )
  })

  it('disables submit until required fields are provided', async () => {
    render(<MarketplaceCompanyForm onSubmit={onSubmit} onCancel={onCancel} />)

    expect(screen.getByText('Save changes')).toBeDisabled()
    fireEvent.submit(screen.getByRole('form'))
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled())
  })

  it('submits the full form', async () => {
    render(<MarketplaceCompanyForm onSubmit={onSubmit} onCancel={onCancel} />)

    fireEvent.click(screen.getByLabelText('Enterprise Buyer'))
    fireEvent.blur(screen.getByLabelText('Enterprise Buyer'))
    changeAndBlur(screen.getByLabelText('Company name'), 'Shinra')
    changeAndBlur(
      screen.getByLabelText('Legal name (optional)'),
      'Shinra, Inc.'
    )
    changeAndBlur(
      screen.getByLabelText('Description (optional)'),
      'More about the company'
    )
    changeAndBlur(
      screen.getByLabelText('Company URL (optional)'),
      'https://example.com'
    )
    await selectReactSelectOption(
      screen.getByLabelText('Organization type'),
      'DN/Health System'
    )
    await selectReactSelectOption(screen.getByLabelText('Region'), 'Northeast')

    await waitFor(() =>
      expect(screen.queryByText('Save changes')).not.toBeDisabled()
    )

    fireEvent.submit(screen.getByRole('form'))
    await waitFor(() => {
      expect(onSubmit).toBeCalledWith({
        activityType: 'ENTERPRISE_BUYER',
        name: 'Shinra',
        legalName: 'Shinra, Inc.',
        href: 'https://example.com',
        description: 'More about the company',
        organizationType: 'DN_HEALTH_SYSTEM',
        region: 'NORTHEAST'
      })
    })
  })

  it('allows submit button text to change', () => {
    render(
      <MarketplaceCompanyForm
        submitText="Add company"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Add company' })
    ).toBeInTheDocument()
  })

  it('disabled `Company type` on edit', async () => {
    render(
      <MarketplaceCompanyForm onSubmit={onSubmit} onCancel={onCancel} isEdit />
    )

    fireEvent.pointerOver(screen.getByLabelText('Enterprise Buyer'))
    expect(
      await screen.findByText('Company type cannot be changed')
    ).toBeInTheDocument()
  })
})
