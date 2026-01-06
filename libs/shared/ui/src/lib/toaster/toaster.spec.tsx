import { render, screen, waitFor } from '@redesignhealth/shared-utils-jest'
import { act } from 'react'

import { Toaster, createAppToaster } from './toaster'

describe('Toaster', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Toaster />)
    expect(baseElement).toBeTruthy()
  })

  it('should display a toast notification', async () => {
    const testToaster = createAppToaster({ placement: 'bottom-end' })

    render(<Toaster toaster={testToaster} />)

    act(() => {
      testToaster.create({
        title: 'Test Toast',
        description: 'This is a test notification',
        type: 'info'
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Test Toast')).toBeInTheDocument()
      expect(screen.getByText('This is a test notification')).toBeInTheDocument()
    })
  })

  it('should display success toast', async () => {
    const testToaster = createAppToaster()

    render(<Toaster toaster={testToaster} />)

    act(() => {
      testToaster.success({
        title: 'Success!',
        description: 'Operation completed successfully'
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })
  })

  it('should display error toast', async () => {
    const testToaster = createAppToaster()

    render(<Toaster toaster={testToaster} />)

    act(() => {
      testToaster.error({
        title: 'Error!',
        description: 'Something went wrong'
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Error!')).toBeInTheDocument()
    })
  })
})

