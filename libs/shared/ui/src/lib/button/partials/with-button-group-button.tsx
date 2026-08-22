import { Button, ButtonGroup } from '../button'

export function WithButtonGroupButton() {
  return (
    <ButtonGroup variant="outline">
      <Button colorPalette="blue">Save</Button>
      <Button>Cancel</Button>
    </ButtonGroup>
  )
}
