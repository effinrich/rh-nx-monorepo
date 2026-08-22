import { InputGroup } from '../input'

import { FlushedCustomInput } from './flushed-custom-input'

export function InputGroupCustomInputPropsInput() {
  return (
    <>
      <InputGroup>
        <FlushedCustomInput m="10px" placeholder="should be flushed" />
      </InputGroup>
      <FlushedCustomInput m="10px" placeholder="is flushed" />
    </>
  )
}
