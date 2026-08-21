import { render, testA11y } from '@redesignhealth/shared-utils-jest'

import { AvatarBadge,AvatarFallback, AvatarImage, AvatarRoot } from './avatar'

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

describe('fallback', () => {
  test('renders a name avatar if no src', () => {
    const utils = render(
      <AvatarRoot>
        <AvatarFallback name="Dan Abramov" />
      </AvatarRoot>
    )
    expect(utils.getByText('DA')).toBeInTheDocument()
  })

  test('renders a default avatar if no name or src', () => {
    const { container } = render(
      <AvatarRoot>
        <AvatarFallback />
      </AvatarRoot>
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  test('renders an image with alt text', () => {
    const utils = render(
      <AvatarRoot>
        <AvatarImage src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
        <AvatarFallback name="Dan Abramov" />
      </AvatarRoot>
    )

    expect(utils.getByAltText('Dan Abramov')).toBeInTheDocument()
  })
})
