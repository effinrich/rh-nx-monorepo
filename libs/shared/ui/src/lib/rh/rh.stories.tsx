import { motion } from 'framer-motion'

import { DarkMode, HTMLRhProps, rh, ThemeProvider, useStyleConfig } from './rh'

export default {
  title: 'System / Core'
}

const MotionBox = motion(rh.div)

export const WithFramerMotion = () => (
  <MotionBox
    mt="40px"
    w="40px"
    h="40px"
    bg="red.200"
    ml="60px"
    animate={{
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 270, 270, 0],
      borderRadius: ['20%', '20%', '50%', '50%', '20%']
    }}
  />
)

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
      sx={{ color: 'teal.500' }}
    >
      Welcome
    </rh.h1>
  </div>
)

export const WithTextStyles = () => {
  return (
    <ThemeProvider
      theme={{
        textStyles: {
          h1: {
            fontSize: ['48px', '72px'],
            fontWeight: 'bold',
            lineHeight: '110%',
            letterSpacing: '-0.01em'
          },
          h2: {
            fontSize: ['36px', '48px'],
            fontWeight: 'light',
            lineHeight: '110%',
            letterSpacing: '-0.01em'
          }
        }
      }}
    >
      <rh.h1 textStyle="h2" color="red.300">
        Welcome
      </rh.h1>
      <rh.p textStyle="h1" color="green.200">
        Welcome text
      </rh.p>
    </ThemeProvider>
  )
}

export const WithGradient = () => (
  <>
    <rh.div bgGradient="linear(to-r, pink.300, blue.500)" w="500px" h="64px" />
    <rh.span
      bgGradient="linear(to-r, red.200, papayawhip)"
      bgClip="text"
      fontSize="7xl"
      fontWeight="extrabold"
    >
      Welcome to Chakra UI
    </rh.span>
  </>
)

export const WithRgbGradient = () => (
  <rh.div
    bgGradient="linear(to-r, rgb(0,0,0), rgb(230,230,230))"
    w="500px"
    h="64px"
  />
)

export const WithLayerStyle = () => (
  <ThemeProvider
    cssVarsRoot="#root"
    theme={{
      space: { 2: '4px' },
      layerStyles: {
        base: {
          bg: 'pink',
          color: 'red'
        }
      },
      textStyles: {
        caps: {
          textTransform: 'uppercase',
          fontWeight: 'bold'
        }
      }
    }}
  >
    <rh.div layerStyle="base" textStyle="caps" color="white" px="2">
      Welcome
    </rh.div>
  </ThemeProvider>
)

const Div = ({ children }: HTMLRhProps<'div'>) => {
  const styles = useStyleConfig('Div')
  return <rh.div sx={styles}>{children}</rh.div>
}

export const WithLayerStyleInComponentTheme = () => (
  <ThemeProvider
    theme={{
      textStyles: {
        caps: {
          textTransform: 'uppercase',
          fontWeight: 'bold'
        }
      },
      components: {
        Div: {
          baseStyle: {
            textStyle: 'caps',
            bg: 'red'
          }
        }
      }
    }}
  >
    <Div>Welcome</Div>
  </ThemeProvider>
)

export const WithCSSVarToken = () => {
  return (
    <rh.div
      sx={{
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
  const styles = useStyleConfig('Badge', {
    variant: 'solid',
    colorPalette: 'blue'
  })
  return (
    <>
      <rh.span>Not forced</rh.span>
      <DarkMode>
        <rh.div bg="gray.800" padding="40px">
          <rh.p color="chakra-body-text">Forced color mode</rh.p>
          <rh.span __css={styles}>Badge</rh.span>
        </rh.div>
      </DarkMode>
    </>
  )
}
