import { MdExpandMore } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  Icon,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Portal
} from '@redesignhealth/ui'

const AddCompanyButton = () => (
  <MenuRoot>
    <MenuTrigger asChild>
      <Button colorPalette="primary">
        Add company <Icon as={MdExpandMore} />
      </Button>
    </MenuTrigger>
    <Portal>
      <MenuContent>
        <MenuItem value="rh-company" asChild>
          <RouterLink to="/companies/add-company">RH company</RouterLink>
        </MenuItem>
        <MenuItem value="marketplace-company" asChild>
          <RouterLink to="/companies/add-marketplace-company">
            Marketplace company
          </RouterLink>
        </MenuItem>
      </MenuContent>
    </Portal>
  </MenuRoot>
)

export default AddCompanyButton
