# Color Mode

React component that adds support for light mode and dark mode using
`localStorage` and `matchMedia`.

## Import

```js
import { ColorModeToggle } from '@redesignhealth/ui'
```

To enable this behavior within your apps, wrap your application in a
`ColorModeProvider` below the `ThemeProvider`

```jsx
import * as React from 'react'
import { ColorModeProvider } from '@redesignhealth/ui'
import theme from './theme'

function App({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ThemeProvider>
  )
}
```

Then you can use the hook `useColorMode` within your application.

```jsx
function Example() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </header>
  )
}
```
