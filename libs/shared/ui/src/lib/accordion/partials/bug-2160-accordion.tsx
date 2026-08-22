import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { rh } from '../../../index'

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot
} from '../accordion'

import { ACCORDION_BUG_DATA } from './accordion-bug-data'

export function Bug2160Accordion() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [displayData, setDisplayData] = useState(ACCORDION_BUG_DATA)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!filter || filter === '') {
      setDisplayData(ACCORDION_BUG_DATA)
    }

    const filteredData = ACCORDION_BUG_DATA.filter(item =>
      item.title.toLowerCase().includes(filter.toLowerCase())
    )
    setDisplayData(filteredData)
  }, [filter])

  useEffect(() => {
    inputRef.current?.focus()
  }, [displayData])

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value)
  }

  return (
    <rh.div padding={4}>
      <rh.div mt={3} mb={12}>
        <rh.input
          ref={inputRef}
          value={filter}
          onChange={onInputChange}
          placeholder="Write filter for data title"
        />
      </rh.div>
      {displayData.length > 0 && (
        <AccordionRoot collapsible>
          {displayData.map((item, i) => (
            <AccordionItem key={`accordion-item-${i}`} value={`item-${i}`}>
              <h2>
                <AccordionItemTrigger>
                  <rh.div flex="1" textAlign="left">
                    {item.title}
                  </rh.div>
                  <AccordionItemIndicator />
                </AccordionItemTrigger>
              </h2>
              <AccordionItemContent pb={4}>{item.text}</AccordionItemContent>
            </AccordionItem>
          ))}
        </AccordionRoot>
      )}
    </rh.div>
  )
}
