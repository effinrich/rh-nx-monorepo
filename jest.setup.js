import '@testing-library/jest-dom'

// Support missing polyfills for JSDOM
import { TextEncoder, TextDecoder } from 'util'
Object.assign(global, { TextDecoder, TextEncoder })
