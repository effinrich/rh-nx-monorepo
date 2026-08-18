import {
  ChangeEvent,
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useRef,
  useState
} from 'react'

import { Container, rh } from '../../index'

import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemIndicator,
  AccordionItemContent
} from './'

export default {
  title: 'Components / Disclosure / Accordion',
  decorators: [
    (
      story: () =>
        | string
        | number
        | boolean
        | ReactElement<any, string | JSXElementConstructor<any>>
        | ReactFragment
        | ReactPortal
        | null
        | undefined
    ) => <Container>{story()}</Container>
  ]
}

export const Basic = () => (
  <AccordionRoot>
    <AccordionItem value="a">
      <h2>
        <AccordionItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <AccordionItemIndicator />
        </AccordionItemTrigger>
      </h2>
      <AccordionItemContent>Panel 1</AccordionItemContent>
    </AccordionItem>

    <AccordionItem value="b">
      <h2>
        <AccordionItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <AccordionItemIndicator />
        </AccordionItemTrigger>
      </h2>
      <AccordionItemContent>Panel 2</AccordionItemContent>
    </AccordionItem>
  </AccordionRoot>
)

export const AllowToggle = () => (
  <AccordionRoot collapsible>
    <AccordionItem value="a">
      <h2>
        <AccordionItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <AccordionItemIndicator />
        </AccordionItemTrigger>
      </h2>
      <AccordionItemContent pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionItemContent>
    </AccordionItem>

    <AccordionItem value="b">
      <h2>
        <AccordionItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <AccordionItemIndicator />
        </AccordionItemTrigger>
      </h2>
      <AccordionItemContent pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionItemContent>
    </AccordionItem>
  </AccordionRoot>
)

export const AllowMultiple = () => (
  <AccordionRoot multiple>
    <AccordionItem value="a">
      <h2>
        <AccordionItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <AccordionItemIndicator />
        </AccordionItemTrigger>
      </h2>
      <AccordionItemContent pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionItemContent>
    </AccordionItem>

    <AccordionItem value="b">
      <h2>
        <AccordionItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <AccordionItemIndicator />
        </AccordionItemTrigger>
      </h2>
      <AccordionItemContent pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionItemContent>
    </AccordionItem>
  </AccordionRoot>
)

export const StylingExpanded = () => (
  <AccordionRoot collapsible>
    <AccordionItem value="a">
      <h2>
        <AccordionItemTrigger _open={{ bg: 'tomato', color: 'white' }}>
          <rh.div flex="1" textAlign="left">
            Click me to see a different style
          </rh.div>
          <AccordionItemIndicator />
        </AccordionItemTrigger>
      </h2>
      <AccordionItemContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionItemContent>
    </AccordionItem>
  </AccordionRoot>
)

const data = [
  { title: 'First Item', text: 'Some value 1...' },
  { title: 'Second Item', text: 'Some value 2...' },
  { title: 'Third Item', text: 'Some value 3...' },
  { title: 'Fourth Item', text: 'Some value 4...' },
  { title: 'Fifth Item', text: 'Some value 5...' },
  { title: 'Some other text', text: 'Some value 6...' },
  { title: 'Another one', text: 'Some value 7...' }
]

export function Bug_2160() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [displayData, setDisplayData] = useState(data)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!filter || filter === '') {
      setDisplayData(data)
    }

    const filteredData = data.filter(item =>
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

export const WithDisabledAccordionItem = () => {
  return (
    <AccordionRoot defaultValue={['2']}>
      <AccordionItem value="1" disabled>
        <AccordionItemTrigger>Button 1</AccordionItemTrigger>
        <AccordionItemContent>One Content</AccordionItemContent>
      </AccordionItem>
      <AccordionItem value="2" disabled>
        <AccordionItemTrigger>Button 2</AccordionItemTrigger>
        <AccordionItemContent>Two Content</AccordionItemContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionItemTrigger>Button 3</AccordionItemTrigger>
        <AccordionItemContent>Three Content</AccordionItemContent>
      </AccordionItem>
      <AccordionItem value="4" disabled>
        <AccordionItemTrigger>Button 4</AccordionItemTrigger>
        <AccordionItemContent>Four Content</AccordionItemContent>
      </AccordionItem>
      <AccordionItem value="5">
        <AccordionItemTrigger>Button 5</AccordionItemTrigger>
        <AccordionItemContent>Five Content</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
}
