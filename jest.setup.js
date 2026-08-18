import '@testing-library/jest-dom'

// Support missing polyfills for JSDOM (Chakra v3 + next-themes)
import { TextEncoder, TextDecoder } from 'util'
Object.assign(global, { TextDecoder, TextEncoder })

if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = value => JSON.parse(JSON.stringify(value))
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    }
  })
})
