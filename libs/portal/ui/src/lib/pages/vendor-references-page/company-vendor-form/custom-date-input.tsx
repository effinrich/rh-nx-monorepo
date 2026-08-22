import { forwardRef } from 'react'
import { MdEditCalendar } from 'react-icons/md'
import { type InputProps, Icon, Input, InputGroup } from '@redesignhealth/ui'

export const CustomDateInput = forwardRef<HTMLInputElement, InputProps>(
  function CustomDateInput({ value, onClick, onChange }, ref) {
    return (
      <InputGroup
        endElement={
          <Icon
            as={MdEditCalendar}
            boxSize={4}
            color="gray.600"
            onClick={onClick}
            cursor="pointer"
          />
        }
      >
        <Input
          autoComplete="off"
          value={value}
          ref={ref}
          onClick={onClick}
          onChange={onChange}
          width="100%"
          maxW="100%"
          placeholder="MM/DD/YYYY"
        />
      </InputGroup>
    )
  }
)
