import { act, mocks, render, testA11y } from '@redesignhealth/shared-utils-jest'

import { AvatarRoot, AvatarImage, AvatarFallback, AvatarBadge } from './avatar'

describe('accessibility', () => {
  test('passes a11y test', async () => {
    await testA11y(
      <AvatarRoot>
        <AvatarFallback />
      </AvatarRoot>,
      {
        axeOptions: {
          rules: {
            'svg-img-alt': { enabled: false }
          }
        }
      }
    )
  })

  test('passes a11y test with AvatarBadge', async () => {
    await testA11y(
      <AvatarRoot>
        <AvatarFallback />
        <AvatarBadge />
      </AvatarRoot>,
      {
        axeOptions: {
          rules: {
            'svg-img-alt': { enabled: false }
          }
        }
      }
    )
  })
})

describe('fallback + loading strategy', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    mocks.image().restore()
  })

  test('renders an image', async () => {
    const mock = mocks.image()
    mock.simulate('loaded')
    const utils = render(
      <AvatarRoot name="Dan Abramov">
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src="https://bit.ly/dan-abramov" />
        <AvatarFallback />
      </AvatarRoot>
    )

    act(() => {
      jest.runAllTimers()
    })

    const img = utils.getByAltText('Dan Abramov')
    expect(img).toBeInTheDocument()
  })

  test('fires onError if image fails to load', async () => {
    const mock = mocks.image()
    mock.simulate('error')

    const src = 'https://bit.ly/dan-abramov'
    const name = 'Dan Abramov'
    const onErrorFn = jest.fn()
    render(
      <AvatarRoot name={name}>
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src={src} onError={onErrorFn} />
        <AvatarFallback />
      </AvatarRoot>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(onErrorFn).toHaveBeenCalledTimes(1)
  })

  test('renders a name avatar if no src', () => {
    const utils = render(
      <AvatarRoot name="Dan Abramov">
        <AvatarFallback />
      </AvatarRoot>
    )
    const img = utils.queryByText('DA')
    expect(img).toBeInTheDocument()
  })

  test('renders a default avatar if no name or src', () => {
    const utils = render(
      <AvatarRoot>
        <AvatarFallback />
      </AvatarRoot>
    )
    expect(utils.getByRole('img')).toHaveClass('chakra-avatar__svg')
  })
})
