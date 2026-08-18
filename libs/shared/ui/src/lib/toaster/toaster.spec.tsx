import { render, screen } from '@redesignhealth/shared-utils-jest'

import { Toaster, toaster } from './toaster'

describe('Toaster', () => {
  it('should render the toast viewport', () => {
    const { baseElement } = render(<Toaster />)
    expect(baseElement).toBeTruthy()
    expect(
      screen.getAllByRole('region', { name: /notifications/i }).length
    ).toBeGreaterThan(0)
  })

  it('should create an info toast via toaster.create', () => {
    render(<div />)
    const id = toaster.create({
      title: 'Test Toast',
      description: 'This is a test notification',
      type: 'info'
    })
    expect(id).toBeTruthy()
  })

  it('should create a success toast via toaster.success', () => {
    render(<div />)
    const id = toaster.success({
      title: 'Success!',
      description: 'Operation completed successfully'
    })
    expect(id).toBeTruthy()
  })

  it('should create an error toast via toaster.error', () => {
    render(<div />)
    const id = toaster.error({
      title: 'Error!',
      description: 'Something went wrong'
    })
    expect(id).toBeTruthy()
  })
})
