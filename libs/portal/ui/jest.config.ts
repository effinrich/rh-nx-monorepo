/* eslint-disable */
export default {
  displayName: 'portal-ui',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.(css|json|svg|png)$': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        presets: ['@nx/react/babel'],
        plugins: ['babel-plugin-transform-vite-meta-env']
      }
    ]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/portal/ui',
  setupFilesAfterEnv: ['../../../jest.setup.js']
}
