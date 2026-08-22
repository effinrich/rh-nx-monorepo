import { NativeSelectField, NativeSelectRoot } from '../select'

export function OverrideStylesSelect() {
  return (
    <NativeSelectRoot color="white" height="60px" bg="tomato">
      <NativeSelectField placeholder="Woohoo! A new background color!" />
    </NativeSelectRoot>
  )
}
