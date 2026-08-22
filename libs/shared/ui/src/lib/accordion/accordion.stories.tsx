import { Meta } from '@storybook/react-vite'

import { Container } from '../../index'

import { AccordionRoot } from './accordion'
import { AllowMultipleAccordion } from './partials/allow-multiple-accordion'
import { AllowToggleAccordion } from './partials/allow-toggle-accordion'
import { BasicAccordion } from './partials/basic-accordion'
import { Bug2160Accordion } from './partials/bug-2160-accordion'
import { StylingExpandedAccordion } from './partials/styling-expanded-accordion'
import { WithDisabledAccordionItemAccordion } from './partials/with-disabled-accordion-item-accordion'

export default {
  component: AccordionRoot,
  title: 'Components / Disclosure / Accordion',
  decorators: [(story: () => unknown) => <Container>{story()}</Container>]
} as Meta<typeof AccordionRoot>

export const Basic = {
  render: () => <BasicAccordion />
}

export const AllowToggle = {
  render: () => <AllowToggleAccordion />
}

export const AllowMultiple = {
  render: () => <AllowMultipleAccordion />
}

export const StylingExpanded = {
  render: () => <StylingExpandedAccordion />
}

export const Bug_2160 = {
  render: () => <Bug2160Accordion />
}

export const WithDisabledAccordionItem = {
  render: () => <WithDisabledAccordionItemAccordion />
}
