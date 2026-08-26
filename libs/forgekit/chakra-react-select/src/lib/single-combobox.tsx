import {
  Box,
  Button,
  Combobox as ChakraComboboxOriginal,
  Portal,
  Spinner
} from '@chakra-ui/react'
import {
  forwardRef,
  useState,
  type ForwardedRef,
  type ReactElement,
  type RefAttributes
} from 'react'

import {
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxPositioner
} from './chakra-combobox-parts'
import type { SingleComboboxProps } from './types'
import { getOptionAccessors, useComboboxState } from './use-combobox-state'

const ChakraCombobox = {
  ...ChakraComboboxOriginal,
  Content: ComboboxContent,
  Control: ComboboxControl,
  Input: ComboboxInput,
  Item: ComboboxItem,
  ItemText: ComboboxItemText,
  Positioner: ComboboxPositioner
}

function SingleComboboxImplementation<Option>(
  props: SingleComboboxProps<Option>,
  ref: ForwardedRef<HTMLInputElement>
) {
  const {
    value,
    defaultValue = null,
    onChange,
    source,
    getOptionLabel: getOptionLabelProp,
    getOptionValue: getOptionValueProp,
    isOptionDisabled,
    creatable,
    renderOption,
    placeholder,
    noOptionsMessage = () => 'No options found',
    loadingMessage = 'Loading options…',
    errorMessage = () => 'Options could not be loaded.',
    id,
    name,
    disabled,
    invalid,
    required,
    readOnly,
    clearable = true,
    loading: loadingProp = false,
    closeOnSelect = true,
    openOnClick = true,
    onBlur,
    withinPortal = true,
    size,
    variant,
    colorPalette,
    positioning,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy
  } = props
  const [uncontrolledValue, setUncontrolledValue] = useState<Option | null>(
    defaultValue
  )
  const selectedOption = value === undefined ? uncontrolledValue : value
  const { getOptionLabel, getOptionValue } = getOptionAccessors({
    getOptionLabel: getOptionLabelProp,
    getOptionValue: getOptionValueProp
  })
  const state = useComboboxState({
    source,
    selectedItems: selectedOption ? [selectedOption] : [],
    getOptionLabel,
    getOptionValue,
    isOptionDisabled,
    creatable
  })
  const isLoading = loadingProp || state.loading

  const updateValue = (nextValue: Option | null) => {
    if (value === undefined) setUncontrolledValue(nextValue)
    onChange?.(nextValue)
  }

  const optionsContent = (
    <ChakraCombobox.Positioner>
      <ChakraCombobox.Content>
        {isLoading ? (
          <Box alignItems="center" display="flex" gap="2" p="2">
            <Spinner size="xs" />
            {loadingMessage}
          </Box>
        ) : state.error ? (
          <Box p="2" role="alert">
            <Box mb="2">{errorMessage(state.error)}</Box>
            <Button onClick={state.retry} size="xs" type="button">
              Retry
            </Button>
          </Box>
        ) : (
          <>
            {state.visibleItems.map(option => {
              const isCreateOption = option === state.createCandidate
              return (
                <ChakraCombobox.Item item={option} key={getOptionValue(option)}>
                  <ChakraCombobox.ItemText>
                    {isCreateOption
                      ? creatable?.formatCreateLabel?.(state.query.trim()) ??
                        `Create “${state.query.trim()}”`
                      : renderOption?.(option, { isCreateOption }) ??
                        getOptionLabel(option)}
                  </ChakraCombobox.ItemText>
                  <ChakraCombobox.ItemIndicator />
                </ChakraCombobox.Item>
              )
            })}
            <ChakraCombobox.Empty>
              {noOptionsMessage(state.query)}
            </ChakraCombobox.Empty>
          </>
        )}
      </ChakraCombobox.Content>
    </ChakraCombobox.Positioner>
  )

  return (
    <ChakraCombobox.Root
      collection={state.collection}
      closeOnSelect={closeOnSelect}
      colorPalette={colorPalette}
      disabled={disabled}
      ids={id ? { input: id } : undefined}
      inputBehavior="autohighlight"
      invalid={invalid}
      onInputValueChange={(details: unknown) =>
        state.setQuery((details as { inputValue: string }).inputValue)
      }
      onInteractOutside={() => onBlur?.()}
      onValueChange={(details: unknown) => {
        const nextValue =
          state.resolveValues((details as { value: string[] }).value)[0] ?? null
        state.commitCreatedOption(nextValue)
        updateValue(nextValue)
      }}
      openOnClick={openOnClick}
      positioning={positioning}
      readOnly={readOnly}
      required={required}
      size={size}
      value={state.selectedValues}
      variant={variant}
      width="full"
    >
      <ChakraCombobox.Control>
        <ChakraCombobox.Input
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          name={name}
          placeholder={placeholder}
          ref={ref}
        />
        <ChakraCombobox.IndicatorGroup>
          {isLoading && <Spinner size="xs" />}
          {clearable && selectedOption && <ChakraCombobox.ClearTrigger />}
          <ChakraCombobox.Trigger />
        </ChakraCombobox.IndicatorGroup>
      </ChakraCombobox.Control>
      {withinPortal ? <Portal>{optionsContent}</Portal> : optionsContent}
    </ChakraCombobox.Root>
  )
}

export type SingleComboboxComponent = <Option>(
  props: SingleComboboxProps<Option> & RefAttributes<HTMLInputElement>
) => ReactElement

export const SingleCombobox = forwardRef(
  SingleComboboxImplementation
) as SingleComboboxComponent
