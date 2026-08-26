import '@testing-library/jest-dom'

class ResizeObserverMock implements ResizeObserver {
  disconnect() {
    return undefined
  }
  observe() {
    return undefined
  }
  unobserve() {
    return undefined
  }
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  value: ResizeObserverMock
})
