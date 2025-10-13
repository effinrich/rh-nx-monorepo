import matchers from '@testing-library/jest-dom/matchers'
import { expect, vi } from 'vitest'

const matchMediaMock = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}))

vi.stubGlobal('matchMedia', matchMediaMock)

expect.extend(matchers)
