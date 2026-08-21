import { Badge } from '../../badge/badge'
import { Wrap, WrapItem } from '../wrap'

export function BasicWrap() {
  return (
    <Wrap gap={['5', '8', '56px']}>
      <WrapItem>
        <Badge>Badge 1</Badge>
      </WrapItem>
      <WrapItem>
        <Badge>Badge 2</Badge>
      </WrapItem>
      <WrapItem>
        <Badge>Badge 3</Badge>
      </WrapItem>
      <WrapItem>
        <Badge>Badge 4</Badge>
      </WrapItem>
    </Wrap>
  )
}
