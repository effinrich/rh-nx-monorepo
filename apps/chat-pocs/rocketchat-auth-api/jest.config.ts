/* eslint-disable */
export default {
  displayName: 'rocketchat-auth-api',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': '@swc/jest'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/chat-pocs/rocketchat-auth-api'
}
