import { render } from '@redesignhealth/shared-utils-jest'

import { AddIcon } from '../../index'

import { CtaCard } from './cta-card'

describe('CtaCard', () => {
  it('should render successfully', () => {
    const onClickTestFn = jest.fn()

    const { baseElement } = render(
      <CtaCard
        title="Set up services, answer questionnaires, and assign users."
        icon={AddIcon}
        ctaText="Add User"
        onClick={onClickTestFn}
      />
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render router Link successfully', () => {
    const { baseElement } = render(
      <CtaCard
        title="Set up services, answer questionnaires, and assign users."
        icon={AddIcon}
        ctaText="Add User"
        to="/new-path"
      />
    )
    expect(baseElement).toBeTruthy()
  })
})
