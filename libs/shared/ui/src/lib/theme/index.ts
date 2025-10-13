import 'focus-visible/dist/focus-visible'

import { extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'

import * as components from './components'
import * as foundations from './foundations'

export const theme = extendTheme(
  {
    ...foundations,
    components: { ...components },
    colors: { ...foundations.colors, primary: foundations.colors.primary }
  },
  withProse({
    baseStyle: {
      '*': {
        overflow: 'hidden'
      },
      '& a': {
        color: 'primary.600',
        textDecoration: 'underline'
      },
      'table,tbody,td,th,tr,main,article,div,span,p': {
        fontFamily: 'Inter, sans-serif!'
      },
      table: {
        marginLeft: '0px!'
      },
      // img: {
      //   width: '100%!',
      //   maxWidth: '650px!',
      //   height: 'auto!'
      // },
      // span: {
      //   width: '100%!',
      //   maxWidth: '650px!',
      //   height: 'auto!'
      // },
      // 'span:has(img)': {
      //   width: '100%!',
      //   maxWidth: '650px!',
      //   height: 'auto!'
      // },
      'img.wide-image': {
        width: '100%!',
        maxWidth: '1300px!',
        height: 'auto!'
      },
      'span:has(img.wide-image)': {
        width: '100%!',
        maxWidth: '1300px!',
        height: 'auto!'
      },
      a: {
        color: 'primary.600',
        textDecoration: 'underline'
      },
      h1: {
        lineHeight: '1.2'
      },
      li: {
        overflow: 'visible'
      },
      pre: {
        fontFamily: 'Monaco',
        fontSize: 'sm',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        overflow: 'auto',
        padding: '0.2rem 0.4rem',
        margin: '0.2rem 0.4rem',
        borderRadius: '0.5rem',
        border: '4px solid blue.500',
        transition: 'all 0.2s ease-in-out'
      }
    }
  })
)
