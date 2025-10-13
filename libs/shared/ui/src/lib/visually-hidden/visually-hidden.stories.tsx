/* eslint-disable no-console */
import { VisuallyHidden, VisuallyHiddenInput } from './visually-hidden'

export default {
  title: 'Components / Disclosure / Visually Hidden'
}
export const HiddenSpan = () => (
  <VisuallyHidden>This is visually hidden</VisuallyHidden>
)

export const HiddenInput = () => (
  <VisuallyHiddenInput
    defaultChecked
    onChange={event => {
      console.log(event.target.checked)
    }}
  />
)
