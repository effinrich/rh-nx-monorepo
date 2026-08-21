import { useState } from 'react'
import { useInterval } from 'react-use'

export function Interval() {
  const [value, setValue] = useState(0)
  useInterval(() => setValue(v => v + 1), 1000)
  return (
    <span style={{ fontWeight: 'bold', color: 'tomato', padding: 4 }}>
      {value}
    </span>
  )
}
