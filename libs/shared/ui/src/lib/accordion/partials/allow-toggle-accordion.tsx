import { rh } from '../../../index'

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot
} from '../accordion'

export function AllowToggleAccordion() {
  return (
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
}
