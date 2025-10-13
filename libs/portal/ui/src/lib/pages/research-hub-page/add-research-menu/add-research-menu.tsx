import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { Button, ChevronDownIcon } from '@redesignhealth/ui'

export const AddResearchMenu = ({
  hideArticlesSupport
}: {
  hideArticlesSupport?: boolean
}) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        colorScheme="primary"
        variant="solid"
      >
        Add research
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} to="/research-hub/research-sprints/add">
          Research report
        </MenuItem>
        <MenuItem as={Link} to="/research-hub/call-notes/add">
          Call notes
        </MenuItem>
        {!hideArticlesSupport && <MenuItem>External content</MenuItem>}
      </MenuList>
    </Menu>
  )
}
