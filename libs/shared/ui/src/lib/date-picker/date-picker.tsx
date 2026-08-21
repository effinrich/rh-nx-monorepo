import ReactDatePicker from 'react-datepicker'
import { MdEditCalendar } from 'react-icons/md'
import { useToken } from '@chakra-ui/react'

import { Icon } from '../icon/icon'
import { InputGroup } from '../input/input'

import { CustomInput } from './custom-input'
import StyledDatePicker from './date-picker.styles'

import 'react-datepicker/dist/react-datepicker.css'

export interface DatePickerProps {
  // isClearable?: boolean
  onChange: (date: Date | null) => void
  selectsRange?: boolean
  selected: Date | null | undefined
  selectsStart?: boolean
  selectsEnd?: boolean
  startDate?: Date
  endDate?: Date
  minDate?: Date
  placeholder?: string
  name?: string
}

export const DatePicker = ({
  selected,
  onChange,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  minDate,
  placeholder,
  selectsRange,
  name,
  ...props
}: DatePickerProps) => {
  const [primary500] = useToken('colors', ['primary.500'])

  return (
    <InputGroup
      endElement={<Icon as={MdEditCalendar} boxSize={4} color="gray.600" />}
    >
      <StyledDatePicker themeColor={primary500}>
        <ReactDatePicker
          placeholderText={placeholder}
          selected={selected}
          name={name}
          onChange={onChange}
          className="react-datapicker__input-text"
          customInput={<CustomInput />}
          dateFormat="MM/dd/yyyy"
          selectsStart={selectsStart}
          selectsEnd={selectsEnd}
          selectsRange={selectsRange}
          withPortal
          {...props}
        />
      </StyledDatePicker>
    </InputGroup>
  )
}

export default DatePicker
