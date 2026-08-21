import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import { AvatarFallback, AvatarGroup,AvatarRoot } from './avatar'

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

test('renders grouped avatars', () => {
  render(
    <AvatarGroup>
      <AvatarRoot>
        <AvatarFallback name="Ada Lovelace" />
      </AvatarRoot>
      <AvatarRoot>
        <AvatarFallback name="Grace Hopper" />
      </AvatarRoot>
    </AvatarGroup>
  )

  expect(screen.getByText('AL')).toBeInTheDocument()
  expect(screen.getByText('GH')).toBeInTheDocument()
})
