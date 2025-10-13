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
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel
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
  <Accordion>
    <AccordionItem>
      <h2>
        <AccordionButton>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>Panel 1</AccordionPanel>
    </AccordionItem>

    <AccordionItem>
      <h2>
        <AccordionButton>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>Panel 2</AccordionPanel>
    </AccordionItem>
  </Accordion>
)

export const AllowToggle = () => (
  <Accordion allowToggle>
    <AccordionItem>
      <h2>
        <AccordionButton>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>

    <AccordionItem>
      <h2>
        <AccordionButton>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
)

export const AllowMultiple = () => (
  <Accordion allowMultiple>
    <AccordionItem>
      <h2>
        <AccordionButton>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>

    <AccordionItem>
      <h2>
        <AccordionButton>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
)

export const StylingExpanded = () => (
  <Accordion allowToggle>
    <AccordionItem>
      <h2>
        <AccordionButton _expanded={{ bg: 'tomato', color: 'white' }}>
          <rh.div flex="1" textAlign="left">
            Click me to see a different style
          </rh.div>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
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
        <Accordion allowToggle>
          {displayData.map((item, i) => (
            <AccordionItem key={`accordion-item-${i}`}>
              <h2>
                <AccordionButton>
                  <rh.div flex="1" textAlign="left">
                    {item.title}
                  </rh.div>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>{item.text}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </rh.div>
  )
}

export const WithDisabledAccordionItem = () => {
  return (
    <Accordion index={1}>
      <AccordionItem isDisabled>
        <AccordionButton>Button 1</AccordionButton>
        <AccordionPanel>One Content</AccordionPanel>
      </AccordionItem>
      <AccordionItem isDisabled>
        <AccordionButton>Button 2</AccordionButton>
        <AccordionPanel>Two Content</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>Button 3</AccordionButton>
        <AccordionPanel>Three Content</AccordionPanel>
      </AccordionItem>
      <AccordionItem isDisabled>
        <AccordionButton>Button 4</AccordionButton>
        <AccordionPanel>Four Content</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>Button 5</AccordionButton>
        <AccordionPanel>Five Content</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
