import { useState } from 'react'

import { Flex } from '../../flex/flex'
import { DatePicker } from '../date-picker'

export function RangeDatePicker() {
  const [startDate, setStartDate] = useState(new Date('2014/02/08'))
  const [endDate, setEndDate] = useState(new Date('2014/02/10'))
  return (
    <Flex w="500px">
      <DatePicker
        selected={startDate}
        onChange={date => date && setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <DatePicker
        selected={endDate}
        onChange={date => date && setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
    </Flex>
  )
}
