import { render, screen } from '@testing-library/react-native'

import App from './app'

test('renders correctly', () => {
  render(<App />)
  expect(screen.getByTestId('heading')).toHaveTextContent('Welcome')
})
