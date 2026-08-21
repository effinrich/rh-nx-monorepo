import { MdExpandMore } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  MenuRoot,
  MenuTrigger,
  MenuItem,
  MenuContent
} from '@redesignhealth/ui'

const AddCompanyButton = () => (
  <MenuRoot>
    <MenuTrigger asChild>
      <Button
        colorPalette="primary"
      >
        Add company
        <MdExpandMore />
      </Button>
    </MenuTrigger>
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
  </MenuRoot>
)

export default AddCompanyButton
