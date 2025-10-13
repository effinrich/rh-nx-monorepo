import { MdExpandMore } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@redesignhealth/ui'

const AddCompanyButton = () => (
  <Menu>
    <MenuButton
      as={Button}
      colorScheme="primary"
      rightIcon={<Icon as={MdExpandMore} />}
    >
      Add company
    </MenuButton>
    <MenuList>
      <MenuItem as={RouterLink} to="/companies/add-company">
        RH company
      </MenuItem>
      <MenuItem as={RouterLink} to="/companies/add-marketplace-company">
        Marketplace company
      </MenuItem>
    </MenuList>
  </Menu>
)

export default AddCompanyButton
