import { VisuallyHidden } from '../visually-hidden'

export function HiddenInput() {
  return (
    <VisuallyHidden asChild>
      <input
        type="checkbox"
        defaultChecked
        onChange={event => {
          // eslint-disable-next-line no-console
          console.log(event.target.checked)
        }}
      />
    </VisuallyHidden>
  )
}
