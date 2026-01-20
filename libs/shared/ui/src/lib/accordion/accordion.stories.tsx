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
import { Accordion } from '@chakra-ui/react'

import { Container, rh } from '../../index'

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
  <Accordion.Root collapsible defaultValue={['item-1']}>
    <Accordion.Item value="item-1">
      <h2>
        <Accordion.ItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </h2>
      <Accordion.ItemContent>Panel 1</Accordion.ItemContent>
    </Accordion.Item>

    <Accordion.Item value="item-2">
      <h2>
        <Accordion.ItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </h2>
      <Accordion.ItemContent>Panel 2</Accordion.ItemContent>
    </Accordion.Item>
  </Accordion.Root>
)

export const AllowToggle = () => (
  <Accordion.Root collapsible>
    <Accordion.Item value="item-1">
      <h2>
        <Accordion.ItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </h2>
      <Accordion.ItemContent pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Accordion.ItemContent>
    </Accordion.Item>

    <Accordion.Item value="item-2">
      <h2>
        <Accordion.ItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </h2>
      <Accordion.ItemContent pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Accordion.ItemContent>
    </Accordion.Item>
  </Accordion.Root>
)

export const AllowMultiple = () => (
  <Accordion.Root multiple>
    <Accordion.Item value="item-1">
      <h2>
        <Accordion.ItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 1 title
          </rh.div>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </h2>
      <Accordion.ItemContent pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Accordion.ItemContent>
    </Accordion.Item>

    <Accordion.Item value="item-2">
      <h2>
        <Accordion.ItemTrigger>
          <rh.div flex="1" textAlign="left">
            Section 2 title
          </rh.div>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </h2>
      <Accordion.ItemContent pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Accordion.ItemContent>
    </Accordion.Item>
  </Accordion.Root>
)

export const StylingExpanded = () => (
  <Accordion.Root collapsible>
    <Accordion.Item value="item-1">
      <h2>
        <Accordion.ItemTrigger _expanded={{ bg: 'tomato', color: 'white' }}>
          <rh.div flex="1" textAlign="left">
            Click me to see a different style
          </rh.div>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </h2>
      <Accordion.ItemContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Accordion.ItemContent>
    </Accordion.Item>
  </Accordion.Root>
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
        <Accordion.Root collapsible>
          {displayData.map((item, i) => (
            <Accordion.Item key={`accordion-item-${i}`} value={`item-${i}`}>
              <h2>
                <Accordion.ItemTrigger>
                  <rh.div flex="1" textAlign="left">
                    {item.title}
                  </rh.div>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </h2>
              <Accordion.ItemContent pb={4}>{item.text}</Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </rh.div>
  )
}

export const WithDisabledAccordionItem = () => {
  return (
    <Accordion.Root defaultValue={['1']}>
      <Accordion.Item disabled value="1">
        <Accordion.ItemTrigger>Button 1</Accordion.ItemTrigger>
        <Accordion.ItemContent>One Content</Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item disabled value="2">
        <Accordion.ItemTrigger>Button 2</Accordion.ItemTrigger>
        <Accordion.ItemContent>Two Content</Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="3">
        <Accordion.ItemTrigger>Button 3</Accordion.ItemTrigger>
        <Accordion.ItemContent>Three Content</Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item disabled value="4">
        <Accordion.ItemTrigger>Button 4</Accordion.ItemTrigger>
        <Accordion.ItemContent>Four Content</Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="5">
        <Accordion.ItemTrigger>Button 5</Accordion.ItemTrigger>
        <Accordion.ItemContent>Five Content</Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
