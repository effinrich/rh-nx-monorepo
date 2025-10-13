import { Fragment } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  ListItem,
  Text,
  UnorderedList
} from '@redesignhealth/ui'

export interface DrawerFormAccordionProps {
  title: string
  expandedTitle?: string
  listItems: Array<{
    header?: string
    items: Array<string>
  }>
}

export const DrawerFormAccordion = (props: DrawerFormAccordionProps) => {
  const expandedTitle = props.expandedTitle ?? props.title
  return (
    <Accordion allowToggle>
      <AccordionItem borderWidth="0px" borderColor="transparent">
        {({ isExpanded }) => (
          <>
            <AccordionButton
              w="fit-content"
              p="0px"
              _hover={{ bg: 'transparent' }}
              fontSize="14px"
              lineHeight="20px"
              fontWeight="medium"
              color="primary.700"
            >
              <Box>{isExpanded ? expandedTitle : props.title}</Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel
              rounded="md"
              fontSize="14px"
              lineHeight="20px"
              fontWeight="normal"
              color="gray.500"
              mt="16px"
              bg="primary.50"
              p="16px"
            >
              {props.listItems &&
                props.listItems.map((list, index) => (
                  <Fragment key={index}>
                    {list?.header && (
                      <Text fontWeight="bold" _notFirst={{ mt: '16px' }}>
                        {list.header}
                      </Text>
                    )}

                    <UnorderedList mt={list.header ? '12px' : undefined}>
                      {list.items.map((item, index) => (
                        <ListItem key={index}>{item}</ListItem>
                      ))}
                    </UnorderedList>
                  </Fragment>
                ))}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  )
}
