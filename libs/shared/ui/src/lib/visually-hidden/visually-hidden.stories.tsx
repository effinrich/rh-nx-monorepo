/* eslint-disable no-console */
import { VisuallyHidden } from './visually-hidden'

export default {
  title: 'Components / Disclosure / Visually Hidden'
}
export const HiddenSpan = () => (
  <VisuallyHidden>This is visually hidden</VisuallyHidden>
)

export const HiddenInput = () => (
  <VisuallyHidden asChild>
    <input
      type="checkbox"
      defaultChecked
      onChange={event => {
        console.log(event.target.checked)
      }}
    />
  </VisuallyHidden>
)
