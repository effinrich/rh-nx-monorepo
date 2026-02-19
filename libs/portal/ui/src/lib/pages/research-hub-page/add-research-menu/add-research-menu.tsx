import { Link } from 'react-router-dom'
import {
  Button,
  ChevronDownIcon,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Portal
} from '@redesignhealth/ui'

export const AddResearchMenu = ({
  hideArticlesSupport
}: {
  hideArticlesSupport?: boolean
}) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button colorPalette="primary" variant="solid">
          Add research <ChevronDownIcon />
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuContent>
          <MenuItem value="research-sprints" asChild>
            <Link to="/research-hub/research-sprints/add">Research report</Link>
          </MenuItem>
          <MenuItem value="call-notes" asChild>
            <Link to="/research-hub/call-notes/add">Call notes</Link>
          </MenuItem>
          {!hideArticlesSupport && (
            <MenuItem value="external-content">External content</MenuItem>
          )}
        </MenuContent>
      </Portal>
    </MenuRoot>
  )
}
