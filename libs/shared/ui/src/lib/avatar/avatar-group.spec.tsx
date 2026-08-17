import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import { AvatarRoot, AvatarFallback, AvatarGroup } from './avatar'

it('passes a11y test', async () => {
  await testA11y(
    <AvatarGroup>
      <AvatarRoot>
        <AvatarFallback />
      </AvatarRoot>
    </AvatarGroup>,
    {
      axeOptions: {
        rules: {
          'svg-img-alt': { enabled: false }
        }
      }
    }
  )
})

test('renders a number avatar showing count of truncated avatars', () => {
  render(
    <AvatarGroup max={2}>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
    </AvatarGroup>
  )
  const moreLabel = screen.getByText('+3')
  expect(moreLabel).toBeInTheDocument()
})

test('does not render a number avatar showing count of truncated avatars if max is equal to avatars given', async () => {
  const utils = render(
    <AvatarGroup max={4}>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
    </AvatarGroup>
  )
  const moreLabel = utils.container.querySelector('.chakra-avatar--excess')
  expect(moreLabel).not.toBeInTheDocument()
})

test('does not render a number avatar showing count of truncated avatars if max is more than avatars given', async () => {
  const utils = render(
    <AvatarGroup max={6}>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
      <AvatarRoot><AvatarFallback /></AvatarRoot>
    </AvatarGroup>
  )
  const moreLabel = utils.container.querySelector('.chakra-avatar--excess')
  expect(moreLabel).not.toBeInTheDocument()
})
