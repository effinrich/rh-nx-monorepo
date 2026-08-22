import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot
} from '../accordion'

export function WithDisabledAccordionItemAccordion() {
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
