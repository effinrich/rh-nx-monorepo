import { useState } from 'react'
import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot
} from '@chakra-ui/react'

import { HStack } from '../../../index'

import { Textarea } from '../textarea'

export function WithResizeTextarea() {
  const [resize, setResize] = useState<'horizontal' | 'vertical' | 'none'>(
    'horizontal'
  )

  return (
    <>
      <RadioGroupRoot
        defaultValue={resize}
        onValueChange={e =>
          setResize(e.value as 'horizontal' | 'vertical' | 'none')
        }
        mb={6}
      >
        <HStack gap={5}>
          <RadioGroupItem value="horizontal">
            <RadioGroupItemHiddenInput />
            <RadioGroupItemControl />
            <RadioGroupItemText>Horizontal</RadioGroupItemText>
          </RadioGroupItem>
          <RadioGroupItem value="vertical">
            <RadioGroupItemHiddenInput />
            <RadioGroupItemControl />
            <RadioGroupItemText>Vertical</RadioGroupItemText>
          </RadioGroupItem>
          <RadioGroupItem value="none">
            <RadioGroupItemHiddenInput />
            <RadioGroupItemControl />
            <RadioGroupItemText>None</RadioGroupItemText>
          </RadioGroupItem>
        </HStack>
      </RadioGroupRoot>

      <Textarea
        placeholder="Here is a sample placeholder"
        size="sm"
        resize={resize}
      />
    </>
  )
}
