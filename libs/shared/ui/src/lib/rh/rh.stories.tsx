import { rh } from './rh'

export default {
  title: 'System / Core'
}

export const ApplyProp = () => (
  <rh.p>
    This is a paragraph, but apply styles from{' '}
    <rh.code fontFamily="mono">styles.h1</rh.code>
  </rh.p>
)

export const WithHeading = () => (
  <div>
    <rh.h1
      fontSize={['50px', '80px', '100px']}
      color="tomato"
      css={{ color: 'teal.500' }}
    >
      Welcome
    </rh.h1>
  </div>
)

export const WithGradient = () => (
  <>
    <rh.div bgGradient="to-r" gradientFrom="pink.300" gradientTo="blue.500" w="500px" h="64px" />
    <rh.span
      bgGradient="to-r"
      gradientFrom="red.200"
      gradientTo="papayawhip"
      bgClip="text"
      fontSize="7xl"
      fontWeight="extrabold"
    >
      Welcome to Chakra UI
    </rh.span>
  </>
)

export const WithCSSVarToken = () => {
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

export const WithSemanticTokens = () => {
  return (
    <div>
      <rh.p color="semantic">I am in the default color mode</rh.p>
      <div data-theme="light">
        <rh.p color="semantic">I am forced to light mode (red)</rh.p>
      </div>
      <div data-theme="dark">
        <rh.p color="semantic">I am forced to dark mode (blue)</rh.p>
        <div data-theme="light">
          <rh.p pl="4" color="semantic">
            I am nested and forced to light mode (red)
          </rh.p>
        </div>
      </div>
    </div>
  )
}

export const WithColorMode = () => {
  return (
    <>
      <rh.span>Not forced</rh.span>
      <div data-theme="dark">
        <rh.div bg="gray.800" padding="40px">
          <rh.p color="fg">Forced dark mode</rh.p>
        </rh.div>
      </div>
    </>
  )
}
