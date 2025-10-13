# Redesign Health UI Theme

This is a Redesign Health UI theme generated with [Hypertheme Editor](https://hyperthe.me).

## Usage

Put the entire directory inside the `src/` folder of your project.

Use it in inside your RhProvider

```tsx
import * as React from 'react'
import { RhProvider } from '@redesignhealth/ui'
import theme from './theme'

function App() {
  return <RhProvider theme={theme}>...rest of code</RhProvider>
}

export default App
```
