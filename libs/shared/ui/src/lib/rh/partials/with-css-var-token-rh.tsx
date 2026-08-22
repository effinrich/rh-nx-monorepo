import { rh } from '../rh'

export function WithCSSVarTokenRh() {
  return (
    <rh.div
      css={{
        '--banner-height': 'sizes.md',
        '.banner': {
          height: 'var(--banner-height)',
          bg: 'red.200'
        }
      }}
    >
      <div className="banner">banner</div>
    </rh.div>
  )
}
