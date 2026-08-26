module.exports = {
  displayName: 'forgekit-chakra-react-select',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['../../../jest.setup.js', '<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  coverageDirectory: '../../../coverage/libs/forgekit/chakra-react-select'
}
