import { rh } from '../../../index'

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot
} from '../accordion'

export function BasicAccordion() {
  return (
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
}
