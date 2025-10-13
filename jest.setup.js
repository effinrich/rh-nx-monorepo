import '@testing-library/jest-dom/extend-expect'

// Support missing polyfills for JSDOM
import { TextEncoder, TextDecoder } from 'util'
Object.assign(global, { TextDecoder, TextEncoder })
