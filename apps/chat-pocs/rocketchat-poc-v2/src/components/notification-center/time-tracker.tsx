import { useEffect, useReducer, useRef } from 'react'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const Wrapper = styled.div`
  color: #666;
`

interface Props {
  createdAt: number
}

export function TimeTracker({ createdAt }: Props) {
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // refresh value of `createdAt` every ~ 1 minute
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      forceUpdate()
    }, 1000)

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout)
    }
  }, [])

  return (
    <Wrapper>
      <span>{dayjs(createdAt).fromNow()}</span>
    </Wrapper>
  )
}
