import { FieldLabel, FieldRoot, HStack, Stack } from '../../../index'

import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function WithFieldCheckbox() {
  return (
    <>
      <FieldRoot id="optIn">
        <FieldLabel>Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['1', '3']}>
          <HStack>
            <CheckboxRoot value="1">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Opt-in 1</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="2">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Opt-in 2</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="3">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Opt-in 3</CheckboxLabel>
            </CheckboxRoot>
          </HStack>
        </CheckboxGroup>
      </FieldRoot>

      <FieldRoot id="optInInvalid" invalid mt={4}>
        <FieldLabel>Invalid Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <CheckboxRoot value="1">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Invalid Opt-in 1</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="2">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Invalid Opt-in 2</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="3">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Invalid Opt-in 3</CheckboxLabel>
            </CheckboxRoot>
          </Stack>
        </CheckboxGroup>
      </FieldRoot>

      <FieldRoot id="optInDisabled" disabled mt={4}>
        <FieldLabel>Disabled Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <CheckboxRoot value="1">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Disabled Opt-in 1</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="2">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Disabled Opt-in 2</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="3">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Disabled Opt-in 3</CheckboxLabel>
            </CheckboxRoot>
          </Stack>
        </CheckboxGroup>
      </FieldRoot>

      <FieldRoot id="optInReadonly" readOnly mt={4}>
        <FieldLabel>Readonly Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <CheckboxRoot value="1">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Readonly Opt-in 1</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="2">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Readonly Opt-in 2</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="3">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Readonly Opt-in 3</CheckboxLabel>
            </CheckboxRoot>
          </Stack>
        </CheckboxGroup>
      </FieldRoot>

      <FieldRoot id="optInRequired" required mt={4}>
        <FieldLabel>Required Opt-in Example</FieldLabel>
        <CheckboxGroup defaultValue={['2', '3']}>
          <Stack gap={2}>
            <CheckboxRoot value="1">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Required Opt-in 1</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="2">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Required Opt-in 2</CheckboxLabel>
            </CheckboxRoot>
            <CheckboxRoot value="3">
              <CheckboxHiddenInput />
              <CheckboxControl />
              <CheckboxLabel>Required Opt-in 3</CheckboxLabel>
            </CheckboxRoot>
          </Stack>
        </CheckboxGroup>
      </FieldRoot>
    </>
  )
}
