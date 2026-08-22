import { AvatarFallback, AvatarGroup, AvatarImage, AvatarRoot } from '../avatar'

export function AvatarsGroupAvatar() {
  return (
    <AvatarGroup size="lg">
      <AvatarRoot>
        <AvatarImage src="https://bit.ly/ryan-florence" alt="Ryan Florence" />
        <AvatarFallback name="Ryan Florence" />
      </AvatarRoot>
      <AvatarRoot>
        <AvatarImage src="https://bit.ly/kent-c-dodds" alt="Kent Dodds" />
        <AvatarFallback name="Kent Dodds" />
      </AvatarRoot>
      <AvatarRoot>
        <AvatarImage
          src="https://bit.ly/prosper-baba"
          alt="Prosper Otemuyiwa"
        />
        <AvatarFallback name="Prosper Otemuyiwa" />
      </AvatarRoot>
      <AvatarRoot>
        <AvatarFallback>+1</AvatarFallback>
      </AvatarRoot>
    </AvatarGroup>
  )
}
