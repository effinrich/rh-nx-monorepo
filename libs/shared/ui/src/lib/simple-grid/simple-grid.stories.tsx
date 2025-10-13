import { Meta } from '@storybook/react'

import { ShadowBox } from '../shadow-box/shadow-box'

import { SimpleGrid } from './simple-grid'

export default {
  component: SimpleGrid,
  title: 'Components / Layout / SimpleGrid'
} as Meta<typeof SimpleGrid>

export const Default = {
  args: {
    columns: 2,
    spacing: 10,
    children: (
      <>
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
      </>
    )
  }
}

export const Responsive = {
  args: {
    columns: [2, null, 3],
    spacing: '40px',
    children: (
      <>
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
      </>
    )
  }
}

export const AutoResponsive = {
  args: {
    minChildWidth: '120px',
    spacing: '40px',
    children: (
      <>
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
      </>
    )
  }
}

export const XAndYSpacing = {
  args: {
    columns: 2,
    spacingX: '40px',
    spacingY: '20px',
    children: (
      <>
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
      </>
    )
  }
}
