/* eslint-disable */
export default {
  displayName: 'shared-hooks',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.(css|json|svg|png)$': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/libs/shared/hooks',
  setupFilesAfterEnv: ['../../../jest.setup.js']
}
