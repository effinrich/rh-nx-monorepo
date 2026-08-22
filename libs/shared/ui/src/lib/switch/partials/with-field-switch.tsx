import { FieldLabel, FieldRoot, Stack } from '../../../index'

import { Switch } from '../switch'

export function WithFieldSwitch() {
  return (
    <>
      <FieldRoot id="optIn">
        <FieldLabel>Opt-in Example</FieldLabel>
        <Stack>
          <Switch value="1">Opt-in 1</Switch>
          <Switch value="2">Opt-in 2</Switch>
          <Switch value="3">Opt-in 3</Switch>
        </Stack>
      </FieldRoot>

      <FieldRoot id="optInInvalid" invalid mt={4}>
        <FieldLabel>Invalid Opt-in Example</FieldLabel>
        <Stack gap={2}>
          <Switch value="1">Invalid Opt-in 1</Switch>
          <Switch value="2">Invalid Opt-in 2</Switch>
          <Switch value="3">Invalid Opt-in 3</Switch>
        </Stack>
      </FieldRoot>

      <FieldRoot id="optInDisabled" disabled mt={4}>
        <FieldLabel>Disabled Opt-in Example</FieldLabel>
        <Stack gap={2}>
          <Switch value="1">Disabled Opt-in 1</Switch>
          <Switch value="2">Disabled Opt-in 2</Switch>
          <Switch value="3">Disabled Opt-in 3</Switch>
        </Stack>
      </FieldRoot>

      <FieldRoot id="optInReadonly" readOnly mt={4}>
        <FieldLabel>Readonly Opt-in Example</FieldLabel>
        <Stack gap={2}>
          <Switch value="1">Readonly Opt-in 1</Switch>
          <Switch value="2">Readonly Opt-in 2</Switch>
          <Switch value="3">Readonly Opt-in 3</Switch>
        </Stack>
      </FieldRoot>

      <FieldRoot id="optInRequired" required mt={4}>
        <FieldLabel>Required Opt-in Example</FieldLabel>
        <Stack gap={2}>
          <Switch value="1">Required Opt-in 1</Switch>
          <Switch value="2">Required Opt-in 2</Switch>
          <Switch value="3">Required Opt-in 3</Switch>
        </Stack>
      </FieldRoot>
    </>
  )
}
