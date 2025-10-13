import { render } from '@redesignhealth/shared-utils-jest'

import { AspectRatio } from './aspect-ratio'

describe('AspectRatio', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AspectRatio maxWidth="400px" ratio={4 / 3}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/7/7d/Minions_characters.png"
          alt="minions"
        />
      </AspectRatio>
    )
    expect(baseElement).toBeTruthy()
  })
})
