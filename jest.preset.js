const nxPreset = require('@nx/jest/preset').default

module.exports = {
  ...nxPreset,
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: "nx affected --targets=test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
  transform: {
    '^.+\\.(css|svg|png|html)$': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        presets: ['@nx/react/babel'],
        plugins: ['babel-plugin-transform-vite-meta-env']
      }
    ]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  /**
   * Needed to solve reading in files using vite's file loader
   * Docs: https://vitejs.dev/guide/assets.html
   * Solution: https://github.com/vitejs/vite/issues/4067#issuecomment-892631379
   */
  moduleNameMapper: {
    '^(.*)\\?raw': `\$1`,
    '^(.*).html\\?raw': `\$1.html`
  }
}
