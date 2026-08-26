import { MdExpandMore } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger
} from '@redesignhealth/ui'

const AddCompanyButton = () => (
  <MenuRoot>
    <MenuTrigger asChild>
      <Button colorPalette="primary">
        Add company
        <MdExpandMore />
      </Button>
    </MenuTrigger>
    <MenuPositioner>
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
    </MenuPositioner>
  </MenuRoot>
)

export default AddCompanyButton
