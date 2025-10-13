# Redesign Health UI Theme

This is a Redesign Health UI theme provider. This is a required wrapper for any Redesign UI driven app.

## Usage

Use use the default theme from `@redesignhealth/ui` or a custom theme for the theme prop.

```tsx
import * as React from 'react'
import { RhProvider } from '@redesignhealth/ui'
import theme from './theme'

function App() {
  return <RhProvider theme={theme}>...rest of code</RhProvider>
}

export default App
```
