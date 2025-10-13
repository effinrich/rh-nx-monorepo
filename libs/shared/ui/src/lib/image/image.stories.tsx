/* eslint-disable no-console */
import { useRef, useState } from 'react'

import { Meta } from '@storybook/react'

import { Box, Stack } from '../../index'

import { Image, ImageProps, Img } from './image'

const Story: Meta<typeof Image> = {
  component: Image,
  title: 'Components / Media & Icons / Image',
  args: {
    src: 'https://bit.ly/dan-abramov',
    alt: 'Dan Abramov'
  }
}
export default Story

export const Basic = {
  render: (args: ImageProps) => {
    return (
      <Box boxSize="sm">
        <Image {...args} />
      </Box>
    )
  }
}

export const FallbackSrcExample = () => (
  <Image
    src="https://bit.ly/dan-abramov"
    fallbackSrc="https://via.placeholder.com/240"
  />
)

export const FallbackElementExample = () => (
  <Image
    src="https://bit.ly/dan-abramov"
    fallback={<div style={{ width: 240, height: 240, background: 'red' }} />}
  />
)

export const WithFit = () => (
  <Image
    src="https://bit.ly/dan-abramov"
    fallbackSrc="https://via.placeholder.com/240"
    fit="cover"
    width="400px"
    height="300px"
  />
)

export const WithNativeWidth = () => (
  <Image
    src="https://bit.ly/dan-abramov"
    fallbackSrc="https://via.placeholder.com/240"
    htmlWidth="300px"
    htmlHeight="300px"
    onLoad={() => {
      console.log('loaded')
    }}
  />
)

export const Bug = () => {
  const [src, setSrc] = useState('')

  const onClick = () => {
    setSrc(
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
    )
  }

  return (
    <div>
      <Image src={src} />
      <button onClick={onClick}>set image</button>
      <p>src set to Avatar: {src}</p>
    </div>
  )
}

export const WithSrcSet = () => {
  const firstRef = useRef<HTMLImageElement>(null)
  const secondRef = useRef<HTMLImageElement>(null)

  const firstLog = (e: any) => {
    console.log(1, 'Image', e.type, firstRef.current?.currentSrc)
  }

  const secondLog = (e: any) => {
    console.log(2, 'Img', e.type, secondRef.current?.currentSrc)
  }

  return (
    <>
      <Image
        ref={firstRef}
        srcSet="//fake.image/ 1x"
        onError={firstLog}
        onLoad={firstLog}
      />
      <Img
        ref={secondRef}
        srcSet="//lorempixel.com/100/100/ 1x"
        onError={secondLog}
        onLoad={secondLog}
      />
    </>
  )
}

export const FallbackStrategies = () => {
  return (
    <>
      <Image
        src="https://via.placeholder.com/240"
        w={240}
        h={240}
        fallbackStrategy="onError"
        fallbackSrc="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
      />
      <Image
        w={240}
        h={240}
        src="https://via.placeholder.com/240"
        fallbackStrategy="beforeLoadOrError"
        fallbackSrc="https://bit.ly/dan-abramov"
      />
    </>
  )
}

export const Size = {
  render: (args: ImageProps) => {
    return (
      <Stack direction="row">
        <Image boxSize="100px" objectFit="cover" {...args} />
        <Image boxSize="150px" objectFit="cover" {...args} />
        <Image boxSize="200px" {...args} />
      </Stack>
    )
  }
}

export const WithBorderRadius = {
  render: (args: ImageProps) => {
    return (
      <Image
        borderRadius="full"
        boxSize="150px"
        src="https://bit.ly/dan-abramov"
        alt="Dan Abramov"
      />
    )
  }
}
