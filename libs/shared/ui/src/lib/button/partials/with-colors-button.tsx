import { Box, Stack, Wrap, WrapItem } from '@chakra-ui/react'

import { Button, ButtonGroup } from '../button'

export function WithColorsButton() {
  return (
    <Stack direction="column">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        py={12}
        bgImage="url('https://bit.ly/2Z4KKcF')"
        bgPosition="center"
        bgRepeat="no-repeat"
        mb={2}
      >
        <ButtonGroup gap="4">
          <Button colorPalette="whiteAlpha">WhiteAlpha</Button>
          <Button colorPalette="blackAlpha">BlackAlpha</Button>
        </ButtonGroup>
      </Box>

      <Wrap gap={4}>
        <WrapItem>
          <Button colorPalette="gray">Gray</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="primary">Primary</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="zap">Zap</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="red">Red</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="orange">Orange</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="yellow">Yellow</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="green">Green</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="teal">Teal</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="blue">Blue</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="cyan">Cyan</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="purple">Purple</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="pink">Pink</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="linkedin">Linkedin</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="facebook">Facebook</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="messenger">Messenger</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="whatsapp">Whatsapp</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="twitter">Twitter</Button>
        </WrapItem>
        <WrapItem>
          <Button colorPalette="telegram">Telegram</Button>
        </WrapItem>
      </Wrap>
    </Stack>
  )
}
