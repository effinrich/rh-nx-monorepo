import { Combobox } from '@chakra-ui/react'
import type { ComponentProps, ComponentType, PropsWithChildren } from 'react'

type WithChildren<Component extends ComponentType> = ComponentType<
  PropsWithChildren<ComponentProps<Component>>
>

export const ComboboxContent = Combobox.Content as WithChildren<
  typeof Combobox.Content
>
export const ComboboxControl = Combobox.Control as WithChildren<
  typeof Combobox.Control
>
export const ComboboxInput = Combobox.Input as ComponentType<
  ComponentProps<typeof Combobox.Input> & ComponentProps<'input'>
>
export const ComboboxItem = Combobox.Item as ComponentType<
  PropsWithChildren<ComponentProps<typeof Combobox.Item> & { item: unknown }>
>
export const ComboboxItemText = Combobox.ItemText as WithChildren<
  typeof Combobox.ItemText
>
export const ComboboxPositioner = Combobox.Positioner as WithChildren<
  typeof Combobox.Positioner
>
