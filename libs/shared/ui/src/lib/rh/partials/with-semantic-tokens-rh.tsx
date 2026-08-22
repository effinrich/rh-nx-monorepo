import { rh } from '../rh'

export function WithSemanticTokensRh() {
  return (
    <div>
      <rh.p color="semantic">I am in the default color mode</rh.p>
      <div data-theme="light">
        <rh.p color="semantic">I am forced to light mode (red)</rh.p>
      </div>
      <div data-theme="dark">
        <rh.p color="semantic">I am forced to dark mode (blue)</rh.p>
        <div data-theme="light">
          <rh.p pl="4" color="semantic">
            I am nested and forced to light mode (red)
          </rh.p>
        </div>
      </div>
    </div>
  )
}
