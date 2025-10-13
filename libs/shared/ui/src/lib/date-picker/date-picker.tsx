import { forwardRef, LegacyRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import { MdEditCalendar } from 'react-icons/md'
import { useToken } from '@chakra-ui/react'

import { Icon } from '../icon/icon'
import {
  Input,
  InputGroup,
  InputProps,
  InputRightElement
} from '../input/input'
import { rh } from '../rh/rh'

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

// const RhDatePicker = rh(ReactDatePicker)

const customDateInput = (
  { value, onClick, onChange }: InputProps,
  ref: LegacyRef<HTMLInputElement>
) => (
  <>
    <Input
      autoComplete="off"
      value={value}
      ref={ref}
      onClick={onClick}
      onChange={onChange}
      placeholder="MM/DD/YYYY"
      maxW="100%"
    />
    <InputRightElement color="gray.600">
      <Icon as={MdEditCalendar} boxSize={4} />
    </InputRightElement>
  </>
)
customDateInput.displayName = 'DateInput'
const CustomInput = forwardRef(customDateInput)

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
    <InputGroup>
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
          // style={{ width: '100%' }}
          {...props}
        />
      </StyledDatePicker>
    </InputGroup>
  )
}

export default DatePicker
