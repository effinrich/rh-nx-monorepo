import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MultipleCombobox } from './multiple-combobox'
import { SingleCombobox } from './single-combobox'

const options = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue' }
]

const provider = (children: React.ReactNode) =>
  render(<ChakraProvider value={defaultSystem}>{children}</ChakraProvider>)

describe('Combobox', () => {
  it('returns the original custom option object from a single selection', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    provider(
      <SingleCombobox
        aria-label="Framework"
        getOptionLabel={option => option.name}
        getOptionValue={option => option.id}
        onChange={onChange}
        source={{ kind: 'local', items: options }}
        withinPortal={false}
      />
    )

    await user.click(screen.getByRole('combobox', { name: 'Framework' }))
    await user.click(screen.getByRole('option', { name: 'React' }))

    expect(onChange).toHaveBeenLastCalledWith(options[0])
  })

  it('returns original option objects from multiple selection', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    provider(
      <MultipleCombobox
        aria-label="Frameworks"
        getOptionLabel={option => option.name}
        getOptionValue={option => option.id}
        onChange={onChange}
        source={{ kind: 'local', items: options }}
        withinPortal={false}
      />
    )

    await user.click(screen.getByRole('combobox', { name: 'Frameworks' }))
    await user.click(screen.getByRole('option', { name: 'React' }))
    await user.click(screen.getByRole('option', { name: 'Vue' }))

    expect(onChange).toHaveBeenLastCalledWith(options)
  })

  it('loads async options with an AbortSignal', async () => {
    const user = userEvent.setup()
    const loadedOption = { id: 'remote', name: 'Remote result' }
    const load = jest.fn(
      async (_query: string, context: { signal: AbortSignal }) => {
        expect(context.signal).toBeInstanceOf(AbortSignal)
        return [loadedOption]
      }
    )

    provider(
      <SingleCombobox
        aria-label="Remote framework"
        getOptionLabel={option => option.name}
        getOptionValue={option => option.id}
        source={{ kind: 'async', debounceMs: 50, minQueryLength: 1, load }}
        withinPortal={false}
      />
    )

    await user.type(
      screen.getByRole('combobox', { name: 'Remote framework' }),
      'remote'
    )

    await waitFor(() =>
      expect(load).toHaveBeenCalledWith('remote', expect.any(Object))
    )
    expect(
      await screen.findByRole('option', { name: 'Remote result' })
    ).toBeInTheDocument()
  })
})
