import { Link } from 'react-router-dom'
import {
  Button,
  ChevronDownIcon,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger
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
          Add research
          <ChevronDownIcon />
        </Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem value="research-report" asChild>
            <Link to="/research-hub/research-sprints/add">Research report</Link>
          </MenuItem>
          <MenuItem value="call-notes" asChild>
            <Link to="/research-hub/call-notes/add">Call notes</Link>
          </MenuItem>
          {!hideArticlesSupport && (
            <MenuItem value="external">External content</MenuItem>
          )}
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}
