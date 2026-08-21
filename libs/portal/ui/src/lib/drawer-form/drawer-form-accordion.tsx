import { Fragment, useState } from 'react'
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  AccordionItemIndicator,
  Box,
  ListItem,
  ListRoot,
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
  const [value, setValue] = useState<string[]>([])
  const isExpanded = value.includes('help')

  return (
    <AccordionRoot
      collapsible
      value={value}
      onValueChange={details => setValue(details.value)}
    >
      <AccordionItem
        value="help"
        borderWidth="0px"
        borderColor="transparent"
      >
        <AccordionItemTrigger
          w="fit-content"
          p="0px"
          _hover={{ bg: 'transparent' }}
          fontSize="14px"
          lineHeight="20px"
          fontWeight="medium"
          color="primary.700"
        >
          <Box>{isExpanded ? expandedTitle : props.title}</Box>
          <AccordionItemIndicator />
        </AccordionItemTrigger>

        <AccordionItemContent
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

                <ListRoot as="ul" mt={list.header ? '12px' : undefined}>
                  {list.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex}>{item}</ListItem>
                  ))}
                </ListRoot>
              </Fragment>
            ))}
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
}
