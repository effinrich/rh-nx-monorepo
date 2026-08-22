import { rh } from '../../../index'

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot
} from '../accordion'

export function StylingExpandedAccordion() {
  return (
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
}
